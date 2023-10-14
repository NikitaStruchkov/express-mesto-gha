// Авторизация в приложении работает как мидлвэр. Если предоставлен верный токен, запрос проходит на дальнейшую обработку. Иначе запрос переходит контроллеру, который возвращает клиенту сообщение об ошибке.


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  // Метод jwt.verify вернёт пейлоуд токена, если тот прошёл проверку. Если же с токеном что-то не так, вернётся ошибка.
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};