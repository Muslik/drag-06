module.exports = (api) => {
  api.cache(true);
  const debug = process.env.EFFECTOR_DEBUG === 'true';

  return {
    plugins: [
      [
        'effector/babel-plugin',
        {
          addLoc: debug,
          addNames: debug,
          debugSids: debug,
          factories: [],
        },
      ],
      debug && [
        'module-resolver',
        {
          alias: {
            effector: 'effector-logger',
          },
        },
      ],
    ].filter(Boolean),
    presets: ["razzle/babel"],
  };
};
