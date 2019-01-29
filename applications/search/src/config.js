export const config = {
  reduxLog: process.env.REDUX_LOG === '1',
  disqusShortname: process.env.DISQUS_SHORTNAME
};
console.log(process.env);
