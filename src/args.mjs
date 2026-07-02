export const parseArgs = (argv, options = {}) => {
  const args = {};
  const booleanFlags = new Set(options.booleanFlags ?? []);
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") {
      continue;
    }
    if (!arg.startsWith("--")) {
      throw new Error(`unexpected positional argument: ${arg}`);
    }
    const name = arg.slice(2);
    if (booleanFlags.has(name)) {
      args[name] = true;
      continue;
    }
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      throw new Error(`missing value for --${name}`);
    }
    args[name] = next;
    index += 1;
  }
  return args;
};

export const requireArg = (args, name) => {
  if (!args[name]) {
    throw new Error(`missing required argument --${name}`);
  }
  return args[name];
};

export const defaultRunId = (prefix = "run") =>
  `${prefix}-${new Date().toISOString().replace(/[:.]/g, "-")}`;
