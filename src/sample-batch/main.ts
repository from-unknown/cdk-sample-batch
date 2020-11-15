import {sleep} from "./util/sleep";

const main: () => Promise<boolean> = async () => {
  console.log('batch START');

  await sleep(5);
  console.log('Hello world!');
  return true;
};

(async () => {
  await main().catch((err: Error) => {
    console.log(err);
  });
  console.log('batch FINISHED');
  process.exit(0);
})();
