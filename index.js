
// rmdir /q/s f:\\zCms\\deploy\\build && mv build ../deploy/ && cd ../deploy && git add . && git commit -m '.' && git push
// const
//     io = require("socket.io-client"),
//     // ioClient = io.connect("http://localhost:3009");
//     ioClient = io.connect("http://35.158.37.66:3009");

// ioClient.on("deploy", (msg) => console.info(msg));
// ioClient.on("connect", (msg) => console.info(msg));
// ioClient.on("kk", (msg) => {
//     console.log(msg)
// });

var fs = require('fs');
try {
    if (fs.existsSync('F:/zCms/deploy/build')) fs.rmdirSync('F:/zCms/deploy/build', { recursive: true })
} catch (e) { console.log(e) }
// fs.renameSync('./build', '../deploy/build')
// const { exec } = require("child_process");
// exec('move ./build F:/zCms/deploy/ && cd ../deploy && git add . && git commit -m "." && git push && cd F:/zCms/cms-client/', (error, stdout, stderr) => {
//     console.log('stdout: ', stdout)
//     gitPull();
// });

function gitPull() {
    const { readFileSync } = require('fs');

    const { Client } = require('ssh2');

    console.log('Connecting ssh');
    const conn = new Client();
    conn.on('ready', () => {
        // console.log('Client :: ready');
        conn.exec(`cd deploy && echo "${process.platform}" >> gitaction.txt`, (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
            }).on('data', (data) => {
                console.log('STDOUT: ' + data);
                process.exit();
            }).stderr.on('data', (data) => {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: 'ec2-18-159-10-75.eu-central-1.compute.amazonaws.com',
        username: 'ubuntu',
        privateKey: readFileSync('./test.pem')
    });
}
gitPull();