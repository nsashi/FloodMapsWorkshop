var util 			= require('util'),
	fs				= require('fs'),
	async	 		= require('async'),
	path			= require('path'),
	moment			= require('moment'),
	request			= require('request'),
	xml2js 			= require('xml2js'),
	_				= require('underscore'),
	mime			= require('mime-types'),
	Hawk			= require('hawk'),
	query_ef5		= require("../lib/query_ef5"),
	debug			= require('debug')('frost');
	
<<<<<<< HEAD
	// lon, lat
	var bbox 		= [10,-10,33,-25]
	var centerlon	= (bbox[0]+bbox[2])/2
	var centerlat	= (bbox[1]+bbox[3])/2
	var target		= [centerlon, centerlat]
	
=======
	function sendFile( res, file ) {
		var ext 		= path.extname(file)
		var basename 	= 	path.basename(file)
		var dirname 	= 	path.dirname(file)
		var ext			= 	path.extname(file)
		
		var mime_type = mime.lookup(path.basename(file))

		debug( "sendFile", ext, mime_type)
		
		if( ext == ".topojson") {
			res.header("Content-Type", "application/json")
			res.header("Content-Encoding", "gzip")
			basename += ".gz"
			debug("sending .topojson application/json gzip", basename)
		} else {
			debug("sending ", mime_type, basename, dirname)
			res.header("Content-Type", mime_type, basename)
			debug(ext, mime_type, "no encoding")
		}
		
		res.header("Access-Control-Allow-Origin", "*")
		res.sendfile(basename, {root: dirname})
	}
>>>>>>> dd153ceacf95e6b97fc07edf09976e11b6467e18
	
	function render_map(region, url, req, res) {
		debug("render_map", url)
		res.render("products/map_api", {
			region: region,
			url: url,
			layout: false
		})
	}
	
	module.exports = {

		product: function(req,res) {
			var year 	= req.params['year']
			var doy 	= req.params['doy']
			var id 		= req.params['id']
			var product	= app.root+"/../data/ef5/"+year+"/"+doy+"/"+id
		
		
			if( !fs.existsSync(product)) {
				if( fs.existsSync(product+".gz")) {
					logger.info("sending as topojson gzip encoded")
					sendFile(res, product)				
				} else {
					logger.error("Product does not exist", product)
					return res.send(400)
				}
			} else {
				logger.info("sending floodmap product", product)
				sendFile(res, product)
			}
		},

		browse: function(req,res) {
			var year 	= req.params['year']
			var doy 	= req.params['doy']
			var date 	= moment(year+"-"+doy)
			var host 	= "http://"+req.headers.host
			var region 	= {
				name: 	req.gettext("legend.flood_forecast.title"),
				scene: 	year+"-"+doy,
<<<<<<< HEAD
				bbox: 	bbox,
				target: target
			}
			
			var jday	= date.dayOfYear()
			if( jday < 10 ) {
				jday = "00"+jday
			} else if( jday < 100 ) jday = "0"+jday
			
			var month = date.month() + 1
			if( month < 10 ) month = "0"+ month

			var day		= date.date();
			if( day < 10 ) day = "0"+day
			
			var s3host				= "https://s3.amazonaws.com/ojo-workshop/sm/"+ year + "/" + jday + "/"
			var browse_img_url		= s3host+date.year()+month+day+".120000_thn.jpg"
			var topojson_url		= s3host+date.year()+month+day+".120000_levels.topojson"
			var topojson_file		= s3host+date.year()+month+day+".120000_levels.topojson.gz"
			
			res.render("products/flood_forecast", {
				social_envs: 	app.social_envs,
				description: 	req.gettext("legend.flood_forecast.title") +" - "+date.format("YYYY-MM-DD"),
				image: 			browse_img_url,
=======
				bbox: [10,-10,33,-25],
				target: [1, 14]
			}
			
			res.render("products/flood_forecast", {
				social_envs: 	app.social_envs,
				description: 	req.gettext("legend.flood_forecast.title") +" - "+date.format("YYYY-MM-DD"),
				image: 			host+"/thn/ef5/"+year+"/"+doy+"/thn.jpg",
>>>>>>> dd153ceacf95e6b97fc07edf09976e11b6467e18
				url: 			host+"/products/flood_forecast/browse/"+year+"/"+doy,
				map_url: 		host+"/products/flood_forecast/map/"+year+"/"+doy,
				date: 			date.format("YYYY-MM-DD"),
				region: 		region,
				data: 			" http://flash.ou.edu/namibia",
<<<<<<< HEAD
				topojson: 		topojson_file,
=======
				topojson: 		host+"/products/flood_forecast/"+year+"/"+doy+"/"+ year+doy+"_flood_forecast.topojson",
>>>>>>> dd153ceacf95e6b97fc07edf09976e11b6467e18
				layout: 		false
			})
		},

		map: function(req,res) {
			var year 	= req.params['year']
			var doy 	= req.params['doy']
			var date 	= moment(year+"-"+doy)
			var host 	= "http://"+req.headers.host
<<<<<<< HEAD
			var bbox	=  bbox
			var id		= year+"-"+doy
=======
			var bbox	= [10,-10,33,-25]
			var id		= year+"-"+doy
						
			var centerlon	= (bbox[0]+bbox[2])/2
			var centerlat	= (bbox[1]+bbox[3])/2
>>>>>>> dd153ceacf95e6b97fc07edf09976e11b6467e18
			
			var region 	= {
				name: 	req.gettext("legend.flood_forecast.title")+" "+date.format(req.gettext("formats.date")),
				scene: 	id,
				bbox: 	undefined,	// feature.bbox,
<<<<<<< HEAD
				target: target,
=======
				target: [centerlat, centerlon],
>>>>>>> dd153ceacf95e6b97fc07edf09976e11b6467e18
				min_zoom: 6
			}
			var url = "/products/flood_forecast/query/"+year+"/"+doy
			render_map(region, url, req, res )
		},
		
		query: function(req, res) {
			var year 		= req.params['year']
			var doy 		= req.params['doy']
			var user		= req.session.user
			var credentials	= req.session.credentials
			
<<<<<<< HEAD
			query_ef5.QueryByID(req, user, year, doy, credentials, function(err, entry) {
				res.send(entry)
			}) 
=======
			var entry = query_ef5.QueryByID(req, user, year, doy, credentials) 
			res.send(entry)
>>>>>>> dd153ceacf95e6b97fc07edf09976e11b6467e18
		},
		
		process: function(req,res) {
	
		}
	};