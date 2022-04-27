export const consoleLogNextmd = (...args: (string | undefined | null)[]) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  args.unshift('[nextmd]');
  console.log.apply(this, args); // tslint:disable-line:no-console
};
