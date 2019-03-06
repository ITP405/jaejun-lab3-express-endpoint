let express = require('express');
let knex = require('knex');

let app = express();
app.get('/api/artists', function(request, response){
  let connection = knex({
    client: 'sqlite3',
    connection:{
      filename: 'chinook.db'
    }
  });
  let filter = request.query.filter;
  if(filter){
    // console.log(filter)
    connection
    .select()
    .from('artists')
    .where('Name', 'like', `%${filter}%`)
    .then((results)=>{
      if(results.length > 0){
        // console.log(results)
        //   response.json(results)
        var reformattedArtists = results.map(result =>{
            var reformat = {'id': result.ArtistId, 'name': result.Name}
            console.log(reformat);
            return reformat;
        })
        response.json(reformattedArtists)
      }
      else{
        console.log("empty")
        response.status(404).json({
          error: `Artists name that contains ${filter} does not exist`
        })
      }
    });
  }
  else{
      connection.select().from('artists').then((artists)=>{
         var reformattedArtists = artists.map(results =>{
          var reformat = {'id': results.ArtistId, 'name': results.Name}
          console.log(reformat);

           return reformat;
        })
        response.json(reformattedArtists)
        // response.json(reformattedArtists);
        //console.log(artists);
      });
  }

});


app.listen(process.env.PORT || 8000);
