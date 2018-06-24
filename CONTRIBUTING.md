# Contributing to FormSchema

**First off, thanks for taking the time to contribute!**

The following is a set of guidelines for contributing to FormSchema and its packages, which are hosted in the [FormSchema Organization](https://gitlab.com/formschema) on GitLab. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

#### Table Of Contents

[I don't want to read this whole thing, I just have a question!!!](#i-dont-want-to-read-this-whole-thing-i-just-have-a-question)

[What should I know before I get started?](#what-should-i-know-before-i-get-started)
  * [FormSchema and Packages](#formschema-and-packages)
  * [FormSchema Design Decisions](#design-decisions)

[How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Pull Requests](#pull-requests)

[Styleguides](#styleguides)
  * [Git Commit Messages](#git-commit-messages)
  * [JavaScript Styleguide](#javascript-styleguide)
  * [Specs Styleguide](#specs-styleguide)
  * [Documentation Styleguide](#documentation-styleguide)

[Additional Notes](#additional-notes)
  * [Issue and Pull Request Labels](#issue-and-pull-request-labels)

## I don't want to read this whole thing I just have a question!!!

> **Note:** Please don't file an issue to ask a question. You'll get faster results by using the resources below.

We have an official message board with a detailed FAQ and where the community chimes in with helpful advice if you have questions.

If chat is more your speed, you can join the FormSchema Gitter team:

* [Join the FormSchema Team](https://gitter.im/formschemaorg)
    * Even though Gitter is a chat service, sometimes it takes several hours for community members to respond &mdash; please be patient!
    * Use the [`general`](https://gitter.im/formschemaorg/general) room for general questions or discussion about FormSchema
    * Use the [`native`](https://gitter.im/formschemaorg/native) room for questions about `@formschema/native`
    * Use the [`elementui`](https://gitter.im/formschemaorg/elementui) room for questions about `@formschema/elementui`
    * There are many other rooms available, check the room list

## What should I know before I get started?

### FormSchema

When you initially consider contributing to FormSchema, you might be unsure about which of repositories implements the functionality you want to change or report a bug for. This section should help you with that.

Here's a list of the big ones:

* [formschema/core](https://gitlab.com/formschema/core) - FormSchema Core
* [formschema/native](https://gitlab.com/formschema/native) - A native HTML wrapping of FormSchema Core
* [formschema/elementui](https://gitlab.com/formschema/elementui) - A ElementUI wrapping of FormSchema Core
* [formschema/material](https://gitlab.com/formschema/material) - A VueMaterial wrapping of FormSchema Core
* [formschema/bulma](https://gitlab.com/formschema/bulma) - A Bulma wrapping of FormSchema Core
* [formschema/buefy](https://gitlab.com/formschema/buefy) - A Buefy wrapping of FormSchema Core
* [website](https://gitlab.com/formschema/website) - the repository for feedback on the [FormSchema website](https://formschema.js.org) and the FormSchema API.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for FormSchema. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer: :computer:, and find related reports :mag_right:.

Before creating bug reports, please check [this list](#before-submitting-a-bug-report) as you might find out that you don't need to create one. When you are creating a bug report, please [include as many details as possible](#how-do-i-submit-a-good-bug-report). Fill out [the required template](ISSUE_TEMPLATE.md), the information it asks for helps us resolve issues faster.

> **Note:** If you find a **Closed** issue that seems like it is the same thing that you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

#### Before Submitting A Bug Report

* Check if you can reproduce the problem in the latest version of FormSchema.
* Determine [which repository the problem should be reported in](#formschema-and-packages).
* Perform a [cursory search](https://gitlab.com/search?scope=issues&search=formschema) to see if the problem has already been reported. If it has **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Bug Report?

Bugs are tracked as [GitLab issues](https://docs.gitlab.com/ee/user/project/issues/). After you've determined [which repository](#formschema-and-packages) your bug is related to, create an issue on that repository and provide the following information by filling in [the template](ISSUE_TEMPLATE.md).

Explain the problem and include additional details to help maintainers reproduce the problem:

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Give a code sample that reproduce the problem**. You can use CodeSandbox for example or include links to files or GitLab projects, or copy/pasteable snippets, which you use. If you're providing snippets in the issue, use [Markdown code blocks](https://about.gitlab.com/handbook/product/technical-writing/markdown-guide/).
* **Explain which behavior you expected to see instead and why.**

Provide more context by answering these questions:

* **Can you reproduce the problem in the last version?**
* **Did the problem start happening recently** (e.g. after updating to a new version of FormSchema) or was this always a problem?
* If the problem started happening recently, **can you reproduce the problem in an older version of FormSchema?** What's the most recent version in which the problem doesn't happen?

Include details about your configuration and environment:

* **Which version of FormSchema are you using?**

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for FormSchema, including completely new features and minor improvements to existing functionality. Following these guidelines helps maintainers and the community understand your suggestion and find related suggestions.

Before creating enhancement suggestions, please check [this list](#before-submitting-an-enhancement-suggestion) as you might find out that you don't need to create one. When you are creating an enhancement suggestion, please [include as many details as possible](#how-do-i-submit-a-good-enhancement-suggestion).

#### Before Submitting An Enhancement Suggestion

* **Check if you're using [the latest version of FormSchema](https://flight-manual.formschema.io/hacking-formschema/sections/debugging/#update-to-the-latest-version)** and if you can get the desired behavior.
* **Determine [which repository the enhancement should be suggested in](#formschema-and-packages).**
* **Perform a [cursory search](https://gitlab.com/search?scope=issues&search=formschema)** to see if the enhancement has already been suggested. If it has, add a comment to the existing issue instead of opening a new one.

#### How Do I Submit A (Good) Enhancement Suggestion?

Enhancement suggestions are tracked as [GitLab issues](https://docs.gitlab.com/ee/user/project/issues/). After you've determined [which repository](#formschema-and-packages) your enhancement suggestion is related to, create an issue on that repository and provide the following information:

* **Use a clear and descriptive title** for the issue to identify the suggestion.
* **Provide a step-by-step description of the suggested enhancement** in as many details as possible.
* **Provide specific examples to demonstrate the steps**. Include copy/pasteable snippets which you use in those examples, as [Markdown code blocks](https://about.gitlab.com/handbook/product/technical-writing/markdown-guide/#code-blocks).
* **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
* **Explain why this enhancement would be useful** to most FormSchema users and isn't something that can or should be implemented as a [community package](#formschema-and-packages).

### Your First Code Contribution

Unsure where to begin contributing to FormSchema? You can start by looking through these `beginner` and `help-wanted` issues:

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues which should be a bit more involved than `beginner` issues.

Both issue lists are sorted by total number of comments. While not perfect, number of comments is a reasonable proxy for impact a given change will have.

#### Local development

FormSchema can be developed locally. For that, just fork the project and add your contributions. The `.gitlab-ci.yml` file describe the build steps.

### Pull Requests

* Fill in [the required template](PULL_REQUEST_TEMPLATE.md)
* Do not include issue numbers in the PR title
* Follow the [JavaScript](#javascript-styleguide) styleguide.
* Include thoughtfully-worded, well-structured [Jasmine](https://jasmine.github.io/) specs in the `./spec` folder. Run them using `npm test`. See the [Specs Styleguide](#specs-styleguide) below.
* Document new code based on the [Documentation Styleguide](#documentation-styleguide)
* End all files with a newline

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[ci skip]` in the commit title

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

* Prefer the object spread operator (`{ ...anotherObj }`) to `Object.assign()`
* Inline `export`s with expressions whenever possible

```js
// Use this:
export default class ClassName {

}

// Instead of:
class ClassName {

}
export default ClassName
```

### Specs Styleguide
- Include thoughtfully-worded, well-structured [Jasmine](https://jasmine.github.io/) specs in the `./spec` folder.
- Treat `describe` as a noun or situation.
- Treat `it` as a statement about state or how an operation changes state.

#### Example
```js
describe('a dog', () => {
  it('barks', () => {
    // spec here
  })
  
  describe('when the dog is happy', () => {
    it('wags its tail', () => {
      // spec here
    })
  })
})
```

### Documentation Styleguide
* Use [JavaScript Standard Style](https://standardjs.com).
* Use [Markdown for samples](https://about.gitlab.com/handbook/product/technical-writing/markdown-guide).

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests. Most labels are used across all FormSchema repositories.

[GitLab search](https://gitlab.com/search?scope=issues&search=formschema) makes it easy to use labels for finding groups of issues or pull requests you're interested in.

The labels are loosely grouped by their purpose, but it's not required that every issue have a label from every group or that an issue can't have more than one label from the same group.

Please open an issue on `formschema/native` if you have suggestions for new labels, and if you notice some labels are missing on some repositories, then please open an issue on that repository.

[beginner]:https://gitlab.com/formschema/native/issues?label_name%5B%5D=good+first+issue
[help-wanted]:https://gitlab.com/formschema/native/issues?label_name%5B%5D=help+wanted
