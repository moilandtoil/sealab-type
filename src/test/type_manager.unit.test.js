"use strict";

const TypeManager = require("../type_manager.js");
const BaseType = require("../base_type.js");
const { SchemaBuilder } = require("@moilandtoil/sealab-schema-builder");
class ValidType extends BaseType {
  constructor(application) {
    super(application);
    this.typeName = "ValidType";
    this.typeDef = `
      type ValidType {
        id: String
        foo: String
      }
    `
  }

  resolver(args, context, info) {
    return {
      id: (value) => {
        return value.id;
      },
      foo: (value) => {
        return value.foo;
      }
    }
  }
}

class NoName extends BaseType {
  constructor(application) {
    super(application);
    this.typeDef = `
      type NoName {
        foo: String
      }
    `
  }

  resolver(args, context, info) {
    return {
      foo: (value) => {
        return value.foo;
      }
    }
  }
}

class NoTypeDef extends BaseType {
  constructor(application) {
    super(application);
    this.typeName = "ValidType";
  }

  resolver(args, context, info) {
    return {
      id: (value) => {
        return value.id;
      },
      foo: (value) => {
        return value.foo;
      }
    }
  }
}

class NoResolver extends BaseType {
  constructor(application) {
    super(application);
    this.typeName = "ValidType";
    this.typeDef = `
      type ValidType {
        id: String
        foo: String
      }
    `
  }
}

describe("Check that TypeManager", () => {

  let logFunc = jest.fn();
  let application = {
    logger: {
      error: logFunc,
      debug: logFunc,
      info: logFunc,
    },
    service: {
      "foo": true
    }
  };

  let typeManager = null;
  beforeEach(() => {
    typeManager = new TypeManager(new SchemaBuilder());
  });

  describe("when registering type", () => {
    test("works with valid type", () => {
      expect(() => {
        typeManager.registerType(ValidType);
      }).not.toThrow();
    });

    test("fails with no type name", () => {
      expect(() => {
        typeManager.registerType(NoName);
      }).toThrow();
    });

    test("fails with no type def", () => {
      expect(() => {
        typeManager.registerType(NoTypeDef);
      }).toThrow();
    });

    test("fails with no type resolver", () => {
      expect(() => {
        typeManager.registerType(NoResolver);
      }).toThrow();
    });
  });
});
