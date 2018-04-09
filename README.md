# Overview
Sealab-type allows for the creation of extendable GraphQL types with
dependency injection. Also includes a type manager for registering the
 types with a [sealab-schema-builder](1) sealab-schema-builder` instance.


# Usage
Create type objects by extending the `BaseType` class.  Configure the
type name and definition in the constructor and define a resolver
function. The helper methods `service`, `logger`, `debug`, `info`, and
`error` will then be available to the resolver.

# Example
```
class CoolType extends BaseType {
  constructor(application) {
    super(application);
    this.typeName = "CoolType";
    this.typeDef = `
      type ValidType {
        id: String
        name: String,
        related_resource: [WhateverResource]
      }
    `
  }

  resolver(args, context, info) {
    return {
      id: (value) => {
        return value.id;
      },
      name: (value) => {
        return value.name;
      },
      related_resource: async (value) => {
        this.debug("Fetching related resources by the parent id");
        return await this.service("whatever_resource").getResourcesByRelatedId(value.id);
      }
    }
  }
}
```

# Notes:
Pay attention to the scope of `this`.  The `resolver` is called by an
`execute` function which returns the object of functions.  This is
passed to the SchemaBuilder, which registers it with GraphQL.

The point being, assume you have no idea what calls it. So you need to
ensure the scope of `this` is the class that extends the `BaseType` class.
Either use the arrow operator when defining the resolver, assign `this`
to a variable outside the object definition, ie.
```
resolver(root, args, context) {
  const type = this;
  return {
    foo: function(value) => {
      type.debug("Calling object `this` through variable assigned in outer scope");
    }
  }
}
```

[1]: https://github.com/moilandtoil/sealab-schema-builder