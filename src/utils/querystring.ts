export interface ObjectToQueryString {
  [index: string]: string | number;
}

const objectToQueryString = (args: ObjectToQueryString): string | undefined => {
  if (args.constructor !== Object) return undefined;

  const keys = Object.keys(args);
  if (keys.length === 0) return undefined;

  let output = '?';
  for (const key of keys) {
    if (output.length > 1) output += '&';
    output += `${key}=${args[key]}`;
  }

  return output;
};

export default objectToQueryString;
