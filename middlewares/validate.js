const { celebrate } = require('celebrate');
const Joi  = require('joi');

const RegExp = /https?:\/\/(www.)?[a-z0-9A-Z\-._~:/?#[\]$&'()*+@,;=]#/;

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(1).max(40),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegExp),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserById = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(RegExp),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(RegExp),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  })
    .messages({
      'string.length': 'Длина id карточки должна быть 24 символа.',
    }),
});

module.exports = {
  validateCreateUser, validateLogin, validateUserById, validateUpdateUser, validateUpdateAvatar, validateCreateCard,
  validateCardId,
};