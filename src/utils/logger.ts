export const consoleLogNextmd = (...args: (string | undefined | null)[]) => {
  args.unshift('[nextmd]');
  console.log.apply(this, args); // tslint:disable-line:no-console
};
