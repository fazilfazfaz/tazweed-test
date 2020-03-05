const jwt = require('jsonwebtoken');
const Hashids = require('hashids');
module.exports = (config) => {
	const hashids = new Hashids(config.hashidsHash, config.hashidsPaddingLength);
	const transformer = (o) => {
		//for(const f in o) {
		//	if(o.hasOwnProperty(f)) {
		//		if(typeof(o[f]) == 'object')
		//			transformer(o[f]);
		//		else if(typeof(o[f]) == 'string' && f.substr(-3) == '_id')
		//			o[f] = hashids.decode(o[f], f)[0];
		//	}
		//}
    }
    const bootAuth = function(req) {
        req.user = null;
        if(req.headers.authorization) {
            let token = req.headers.authorization.substr();
            if(token) {
                try {
                    req.user = jwt.verify(token, config.jwt_secret);
                } catch(e) {
                }
            }
        }
    }
    return {
        logBody: (req, res, next) => {
            console.log(req.body)
            next()
        },
		checkAuth: (req, res, next) => {
            bootAuth(req);
			next()
		},
        enforceAuth: (req, res, next) => {
            bootAuth(req);
            if(req.user) {
                next()
            } else {
                res.status(401)._json();
            }
		},
		transform_ids: (req, res, next) => {
			transformer(req.body);
			transformer(req.params);
			next()
		},
		verifyAuth: (req, res, next) => {
			if(req.user === null)
				res.status(403)._json();
			else			
				next()
		}
	}
}