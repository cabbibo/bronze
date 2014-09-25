function N2( title , mesh , extraParams ){

  

  var title = title || 'HELLO';
  var mesh = mesh || new THREE.Mesh( new THREE.BoxGeometry( 1000 , 1000 , 1000 , 80 , 80 , 80 ) );
  var geometry = new THREE.Geometry();

  geometry.merge( mesh.geometry , mesh.matrix );
  
 // var geometry =  || new THREE.BoxGeometry( 1000 , 1000 , 1000 , 80 , 80 , 80 );
 

  var v = geometry.vertices.length;

  var vSize = Math.ceil( Math.sqrt( v ) );
  var hSize = .5 / vSize;


  //console.log( shaders.simulationShaders.n2 );
 
  var s = shaders.setValue( shaders.simulationShaders.n2 , 'SIZE'  , vSize+"." );
      s = shaders.setValue( s , 'HSIZE' , hSize+"" );
  
  var params =  {

    repelers: REPELERS,

    vs: shaders.vertexShaders.fire,
    fs: shaders.fragmentShaders.normal,
    ss: s,

    geometry: geometry,


    dT: G_UNIFORMS.dT,
    time: G_UNIFORMS.time,

    soul:{
       
      noiseSize:          { type:"f" , value: .001 , constraints:[.0001 , .005] },
      noiseVariation:     { type:"f" , value: .4   , constraints:[.01 , 1.] },
      noiseChangeSpeed:   { type:"f" , value: 1   , constraints:[.0 , 5.] },
      noisePower:         { type:"f" , value: 1   , constraints:[0 , 10.] },
      returnPower:        { type:"f" , value: 5000   , constraints:[ 100 ,10000 ] },
      staticLength:       { type:"f" , value: 10.  , constraints:[ .001 ,20 ] },
      maxVel:             { type:"f" , value: .01   , constraints:[ .00001 , .1 ] },
      t_audio:            G_UNIFORMS.t_audio,

    },

    body:{
      
      audioDisplacement:{ type:"f" , value : 0.0 ,  constraints:[ 0 , 1 ]},
      custom1:{type:"f" , value: 5.,  constraints:[ .1 , 100]},
      lightPos:{type:"v3" , value: new THREE.Vector3( 10 , 1 , 1 )},
      
      t_audio:   G_UNIFORMS.t_audio,

    },

  }



  //Passing through extra params
 
  var extraParams = extraParams || {};
 
  if( extraParams.soul ){
    var s = extraParams.soul;
    for( var propt in s ){
      params.soul[propt] = s[propt];
    }
  }

  if( extraParams.body ){
    var s = extraParams.body;
    for( var propt in s ){
      params.body[propt] = s[propt];
    }
  }


  if( extraParams.vs ) params.vs = extraParams.vs;
  if( extraParams.fs ) params.fs = extraParams.fs;

  var gem = new GEM( params );
 
  var gHolder = document.createElement('div');

  var tHolder = document.createElement('h1');

  tHolder.innerHTML =''+ title;

  gHolder.appendChild( tHolder );
  var guis = document.getElementById( 'GUI' );

  guis.appendChild( gHolder );

 /* $(tHolder).click(function(){
    this.toggle();
    if( this.active ){
      this.tHolder.className = "active";
    }else{
      this.tHolder.className = "";
    }
  }.bind( gem ));*/


  $(tHolder).hover(function(){
    this.gui.gui.open();
  }.bind( gem ));

  $(gHolder).hover(function(){},function(){
    this.gui.gui.close();
  }.bind(gem));

  gem.tHolder = tHolder;

  gem.gui = new GUI( params , {
   domElement: gHolder 
  });


  gem.soul.reset( gem.t_og.value );
  
  return gem;

}

