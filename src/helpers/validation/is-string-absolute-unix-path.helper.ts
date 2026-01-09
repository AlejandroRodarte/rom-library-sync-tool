const isStringAbsoluteUnixPath = (s: string) => /^(?:\/[^/]+)+$/.test(s);

export default isStringAbsoluteUnixPath;
