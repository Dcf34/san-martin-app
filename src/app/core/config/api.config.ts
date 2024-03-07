const api_env = {
    dev: 'https://localhost:7105',
}

//Cambiar ambiente actual
const actual_env = api_env.dev;

const app = actual_env === api_env.dev ? '' : '';

export const apiHost = `${actual_env}/${app}`;
export const apiPrefix = 'api/v1';