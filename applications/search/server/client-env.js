// This is filtered set of variables that get sent to client

module.exports.clientEnv = {
  REDUX_LOG: process.env.REDUX_LOG,
  DISQUS_SHORTNAME: process.env.DISQUS_SHORTNAME
  /*
TODO:
 There are currently lots of environment dependent configuration hardcoded in client code.
 Keep the list until the migration is gradually done:
  Twitter
  Analytics
  hotjar
  registration host
*/
};
