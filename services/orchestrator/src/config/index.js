import { Joi } from "celebrate";
import { moduleLogger } from "@sliit-foss/module-logger";

const logger = moduleLogger("Config");

class Base {
  static get schema() {
    return {
      PORT: Joi.number().optional(),
      AUTH_SERVICE_BASE_URL: Joi.string().required(),
      USER_SERVICE_BASE_URL: Joi.string().required(),
      EMAIL_SERVICE_BASE_URL: Joi.string().required(),
      ORDER_SERVICE_BASE_URL: Joi.string().required(),
      PAYMENT_SERVICE_BASE_URL: Joi.string().required(),
      REVIEW_SERVICE_BASE_URL: Joi.string().required(),
    };
  }
  static get values() {
    return {
      PORT: process.env.PORT ?? 2002,
      AUTH_SERVICE_BASE_URL: process.env.AUTH_SERVICE_BASE_URL,
      USER_SERVICE_BASE_URL: process.env.USER_SERVICE_BASE_URL,
      EMAIL_SERVICE_BASE_URL: process.env.EMAIL_SERVICE_BASE_URL,
      ORDER_SERVICE_BASE_URL: process.env.ORDER_SERVICE_BASE_URL,
      PAYMENT_SERVICE_BASE_URL: process.env.PAYMENT_SERVICE_BASE_URL,
      REVIEW_SERVICE_BASE_URL: process.env.REVIEW_SERVICE_BASE_URL,
    };
  }
}

const config = Base.values;

const { error } = Joi.object(Base.schema).validate(config);

if (error) {
  logger.error(
    `Environment validation failed. \nDetails - ${error.details[0].message}\nExiting...`
  );
  process.exit(1);
}

export default config;
