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
  ObjectFieldChild,
  IObjectChildDescriptor
} from '@/types';

export class ObjectUIDescriptor extends UIDescriptor<ObjectField> implements IObjectDescriptor {
  readonly properties: Dict<DescriptorInstance>;
  readonly schemaProperties: Dict<DescriptorInstance>;
  readonly groups: Dict<ObjectGroupDescriptor>;
  readonly order: string[] = [];
  readonly orderedProperties: string[] = [];
  readonly parsedGroups = [];

  constructor(options: ObjectDescriptor, field: Readonly<ObjectField>, components: Components) {
    super(options, field, components);

    this.schemaProperties = field.schema.properties || {};
    this.properties = options.properties || {};
    this.groups = options.groups || {};

    if (options.order instanceof Array) {
      this.order = [ ...options.order ];
    }

    this.parseOrder();
    this.parseDependencies();
    this.parseSchemaProperties();
  }

  get children() {
    return this.getChildren(this.orderedProperties);
  }

  get childrenGroups() {
    const groupsIds: string[] = [];
    const ordoredGroups: Dict<string[]> = {};

    if (Objects.isEmpty(this.groups)) {
      const groupId = UniqueId.get(this.field.name);

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
        const groupId = reverseGroups[property] || UniqueId.get(this.field.name);

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
      children: this.getChildren(ordoredGroups[groupId])
    }));
  }

  getChildren(properties: string[]) {
    return properties
      .map((property) => this.field.children[property])
      .map((field) => this.getDescriptor(field));
  }

  getDescriptor(field: ObjectFieldChild): IObjectChildDescriptor {
    const options = this.properties[field.property] || {};
    const descriptor = UIDescriptor.get(options, field, this.components);

    return descriptor === null
      ? UIDescriptor.get({ kind: 'string' }, field, this.components) as any
      : descriptor;
  }

  parseOrder() {
    if (this.order.length === 0) {
      this.order.push(...Object.keys(this.schemaProperties));
    }
  }

  parseSchemaProperties() {
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

  parseDependencies() {
    const dependencies = this.field.schema.dependencies;

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
}

UIDescriptor.register('object', ObjectUIDescriptor);
