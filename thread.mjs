import {
    threadId,
    parentPort
} from 'node:worker_threads'

// Essa thread vai executar uma tarefa, e quando executar já morre.
parentPort.once('message', ({ from, to}) => {
    console.time(`benchamark-${threadId}`);

    let count = 0;
    for (let i = from; i < to; i++) { count++; }

    console.timeEnd(`benchamark-${threadId}`);
    parentPort.postMessage(`Terminei a Thread ${threadId}! Com ${count} items`);
})