
// 🧩 NOTE-START: Travar o NODEJS
// for (let i = 0; i < 1e20; i++);
// 🧩 NOTE-END: Travar o NODEJS

// 🎯 NOTE: A ideia é executar esse loop acima, sem travar o NodeJS, ou seja, o EVENT-LOOP
// UV_THREADPOOL_SIZE=10 node index.mjs

import { execSync } from 'node:child_process';
import { Worker } from 'node:worker_threads';

// Pra saber quantas threads estão rodando.
function getCurrentThreadCount() {
    // Obtem quantidade de threads no processo e conta.
    return parseInt(execSync(`ps -M ${process.pid} | wc -l`).toString());
}

function createThread(data) {
    const worker = new Worker('./thread.mjs');

    const p = new Promise((resolve, reject) => {
        worker.once('message', (message) => {
            return resolve(message)
        })
        worker.once('error', reject);
    })

    worker.postMessage(data);
    return p;
}

// -1 porque o processo principal conta como uma thread, então ignoramos ele.;
const nodejsDefaultThreadNumber = getCurrentThreadCount() - 1

console.log(
    `\t🚀 ESTOU RODANDO 🚀\n`,
    `\tID processo em Exec.: ${process.pid}\n`,
    `\tQuant. Threads por padrão: ${nodejsDefaultThreadNumber}\n`
);

let nodejsThreadCount = 0;
const intervalId = setInterval(() => {
    // Dessa forma, vemos somente as threads que criamos manualmente.
    const currentThreads = getCurrentThreadCount() - nodejsDefaultThreadNumber;
    if (currentThreads == nodejsThreadCount) return;

    nodejsThreadCount = currentThreads;
    console.log('🤖 THREADS:', nodejsThreadCount);
});

await Promise.all(
    [
        createThread({ from: 0, to: 1e9 }),
        createThread({ from: 0, to: 1e9 }),
        createThread({ from: 0, to: 1e8 }),
        createThread({ from: 0, to: 1e10 }),
        createThread({ from: 0, to: 1e3 }),
    ]
).then((results) => {
    console.log('\n✅ Todas as threads foram concluídas com sucesso!');
    console.log(results);
});

clearInterval(intervalId);