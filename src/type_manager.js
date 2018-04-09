"use strict";



class TypeManager {
  constructor(schemaBuilder) {
    this.schemaBuilder = schemaBuilder;
  }

  registerType(typeClass, application) {
    const typeInstance = new typeClass(application);

    if (!typeInstance.typeName || typeInstance.typeName.length == 0) {
      throw new Error("Type must have a name");
    }

    if (!typeInstance.typeDef || typeInstance.typeDef.length == 0) {
      throw new Error("Type must have a definition");
    }

    if (!typeInstance.resolverOverwritten()) {
      throw new Error("Type must have a resolver");
    }

    this.schemaBuilder.addType(
      typeInstance.typeName,
      typeInstance.typeDef,
      typeInstance.execute.bind(typeInstance)
    );
  }
}

module.exports = TypeManager;