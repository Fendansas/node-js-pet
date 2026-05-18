import crypto from 'crypto';


const SECRET_KEY = process.env.JWT_SECRET;

function getSecretKey() {

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return secret;
}

function base64url(input) {
    return Buffer.from(input)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function createSignature(data){
    console.log(getSecretKey())
    return crypto
        .createHmac('sha256', getSecretKey())
        .update(data)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

export function generateToken(payload, expiresIn = 3600) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const exp = Math.floor(Date.now() / 1000) + expiresIn;

    const body = {
        ...payload,
        exp
    };

    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(body));

    const data = `${encodedHeader}.${encodedPayload}`;

    const signature = createSignature(data);

    return `${data}.${signature}`;
}

export function verifyToken(token){
    try {
        const [header, payload, signature] = token.split('.');

        const data = `${header}.${payload}`;

        const validSignature = createSignature(data);

        if(signature !== validSignature){
            return null;
        }

        const decodedPayload = JSON.parse(
            Buffer.from(payload, 'base64').toString('utf-8'));

        if (decodedPayload.exp < Math.floor(Date.now()/1000)){
            return null;
        }

        return decodedPayload;

    } catch (err) {
        return null;
    }
}