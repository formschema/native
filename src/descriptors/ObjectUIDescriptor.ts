import { UIDescriptor } from '@/descriptors/UIDescriptor';
import { Components } from '@/lib/Components';
import { Objects } from '@/lib/Objects';
import { UniqueId } from '@/lib/UniqueId';

import {
  Dict,
  ObjectField,
  ObjectDescriptor,
  DescriptorInstance,
  ObjectGroupDescriptor,
  IObjectDescriptor,
  IObjectGroupItem,
  Component,
  ObjectFieldChild
} from '@/types';

type ObjectChild = {
  id: string;
  label: string | undefined;
  children: ObjectFieldChild[];
};

export class ObjectUIDescriptor extends UIDescriptor<ObjectField, ObjectDescriptor> implements IObjectDescriptor {
  readonly layout: Component;
  readonly properties: Dict<DescriptorInstance>;
  readonly schemaProperties: Dict<DescriptorInstance>;
  readonly groups: Dict<ObjectGroupDescriptor>;
  readonly order: string[] = [];
  readonly orderedProperties: string[] = [];
  readonly parsedGroups = [];
  readonly childrenGroups: IObjectGroupItem[] = [];

  constructor(options: ObjectDescriptor, field: Readonly<ObjectField>, components: Components) {
    super(options, field, components);

    this.layout = options.layout || 'fieldset';
    this.schemaProperties = field.schema.properties || {};
    this.properties = options.properties || {};
    this.groups = options.groups || {};

    if (options.order instanceof Array) {
      this.order.push(...options.order);
    }
  }

  getChildrenGroups(field: Readonly<ObjectField>): ObjectChild[] {
    const groupsIds: string[] = [];
    const ordoredGroups: Dict<string[]> = {};

    if (Objects.isEmpty(this.groups)) {
      const groupId = UniqueId.get(field.name);

      ordoredGroups[groupId] = this.orderedProperties;

      groupsIds.push(groupId);
    } else {
      const reverseGroups: Dict<string> = {};

      // setting the reverse groups cache
      for (const groupId in this.groups) {
        this.groups[groupId].properties.forEach((property) => {
          reverseGroups[property] = groupId;
        });
      }

      // generate groups
      for (let i = 0; i < this.orderedProperties.length; i++) {
        const property = this.orderedProperties[i];
        const groupId = reverseGroups[property] || UniqueId.get(field.name);

        if (this.groups[groupId]) {
          if (!ordoredGroups[groupId]) {
            groupsIds.push(groupId);

            ordoredGroups[groupId] = this.groups[groupId].properties;
          }
        } else {
          let j = i;

          ordoredGroups[groupId] = [];

          groupsIds.push(groupId);

          do {
            ordoredGroups[groupId].push(this.orderedProperties[j]);
          } while (++j < this.orderedProperties.length && !reverseGroups[this.orderedProperties[j]]);

          i = j - 1;
        }
      }
    }

    return groupsIds.map((groupId) => ({
      id: groupId,
      label: this.groups[groupId] ? this.groups[groupId].label : undefined,
      children: ordoredGroups[groupId].map((property) => field.fields[property])
    }));
  }

  parseOrder(): void {
    if (this.order.length === 0) {
      this.order.push(...Object.keys(this.schemaProperties));
    }
  }

  parseSchemaProperties(): void {
    const keys = Object.keys(this.schemaProperties);

    this.orderedProperties.push(...this.order);

    if (this.orderedProperties.length < keys.length) {
      keys.forEach((prop) => {
        if (!this.orderedProperties.includes(prop)) {
          this.orderedProperties.push(prop);
        }
      });
    }
  }

  parseDependencies(): void {
    const dependencies = this.schema.dependencies;

    if (dependencies) {
      Object.keys(dependencies).forEach((key) => {
        const dependency = dependencies[key];

        if (!Array.isArray(dependency)) {
          const indexKey = (this.order.indexOf(key) + 1) || this.order.length;
          const properties = dependency.properties || {};

          Object.keys(properties).forEach((prop, indexProp) => {
            if (!this.order.includes(prop)) {
              // insert dependency after its sibling property
              // if's there is no custum order defined
              this.order.splice(indexKey + indexProp, 0, prop);
            }
          });
        }
      });
    }
  }

  parse(field: ObjectField): void {
    super.parse(field);

    this.parseOrder();
    this.parseDependencies();
    this.parseSchemaProperties();
    this.update(field);
  }

  update(field: ObjectField): void {
    this.childrenGroups.splice(0);
    this.childrenGroups.push(...this.getChildrenGroups(field));
  }
}

UIDescriptor.register('object', ObjectUIDescriptor);
