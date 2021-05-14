import kingbot from './src';

const gameworld = 'COM7';
const email = 'etherge@gmail.com';
const password = 'lkgpassw0rd@';
// only change if needed
const sitter_type = ''; // 'sitter' or 'dual'
const sitter_name = ''; // ingame avatar name
const port = 3007;

kingbot.start_server(gameworld, email, password, sitter_type, sitter_name, port);
