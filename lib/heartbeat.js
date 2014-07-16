exports.heartbeat = function( params, callback ) {
  console.log( "Returning Heartbeat" );
  return callback( null, {heartbeat:"success"} );
};
