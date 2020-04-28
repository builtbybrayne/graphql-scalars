import { Kind, GraphQLError, GraphQLScalarType } from 'graphql';

const validate = (value: any) => {
  const GUID_REGEX = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;

  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`);
  }

  if (value.startsWith('{')) {
    value = value.substring(1, value.length - 1);
  }

  if (!GUID_REGEX.test(value)) {
    throw new TypeError(`Value is not a valid GUID: ${value}`);
  }

  return value;
};

export default new GraphQLScalarType({
  name: `GUID`,

  description: `A field whose value is a generic Globally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier.`,

  serialize(value) {
    return validate(value);
  },

  parseValue(value) {
    return validate(value);
  },

  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as GUIDs but got a: ${ast.kind}`,
      );
    }

    return validate(ast.value);
  },
});
