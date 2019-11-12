import jwt from 'jsonwebtoken';

// eslint-disable-next-line consistent-return
const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'This account doesn\'t have admin permission!',
    });
  }

  const p = new Promise(
    (resolve, reject) => {
      jwt.verify(token, req.app.get('jwt-secret'), (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    },
  );

  const onError = (error) => {
    res.status(403).json({
      success: false,
      message: error,
    });
  };

  p.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError); // onError() 형태로 넣으면 함수가 바로 실행돼서 문제가 된다
};

export default authMiddleware;
