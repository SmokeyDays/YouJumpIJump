import winston, { format } from "winston";
const { MESSAGE } = require('triple-beam');

const myFormat = format(info => {
  const stringifiedRest = JSON.stringify(Object.assign({}, info, {
    level: undefined,
    message: undefined,
    splat: undefined,
    timestamp: undefined,
  }));
  const padding = info.padding && info.padding[info.level] || '';
  if (stringifiedRest !== '{}') {
    info[MESSAGE] = `[${info.timestamp}][${info.level}]:${padding} ${info.message} ${stringifiedRest}`;
  } else {
    info[MESSAGE]  = `[${info.timestamp}][${info.level}]:${padding} ${info.message}`;
  }
  return info;
});

const config = {
  levels: {
    error: 0,
    debug: 1,
    warn: 2,
    data: 3,
    info: 4,
    verbose: 5,
    silly: 6,
  },
  colors: {
    error: 'red',
    debug: 'blue',
    warn: 'yellow',
    data: 'grey',
    info: 'green',
    verbose: 'cyan',
    silly: 'magenta',
  }
};

winston.addColors(config.colors);

const GLOBAL_LOGGER_SETTING = {
  levels: config.levels,
  level: 'silly',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.colorize(),
    myFormat(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "./logs/server.log" }),
  ],
};

export const logger = winston.createLogger(GLOBAL_LOGGER_SETTING);