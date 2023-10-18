// Авторизация в приложении работает как мидлвэр.
// Если предоставлен верный токен, запрос проходит на дальнейшую обработку.
// Иначе запрос переходит контроллеру, который возвращает клиенту сообщение об ошибке.

const JWT_KEY = '3b2c0b48afb683532c72b31d8538ccdac9398a91ea91b290e0a90599393c65aa';
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  // Метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку.
  // Если же с токеном что-то не так, вернётся ошибка.
  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
