HTMLWidgets.widget({

	name: "myScatterplot",

	type: "output",

	factory: function(el, width, height)
	{
		var widget = new Widget(el);

		return {
			renderValue: function(x)
			{
				widget.initgui(x);
				widget.createplot(x);
				widget.render();
				widget.animate();
			}
		};
	}
});

var Widget = function(el)
{
	//global variables
	var width = el.offsetWidth;
	var height = el.offsetHeight;

	var _this = this;

	_this.stage = 1;
	_this.ConstantRate = false;
	var ps = {
		stage: 1,
		ConstantRate: false
	};

	_this.initgui = function(x) {
	  _this.stages = x.stages;
		var gui = new dat.GUI();
		gui.add(ps, "stage",1,_this.stages,1).onChange(function (value) {_this.stage = value});
		gui.add(ps,"ConstantRate").onChange(function (value) {_this.ConstantRate = value});
	};

	//scene & camera
	var scene = new THREE.Scene();
	_this.camera = new THREE.PerspectiveCamera( 40, width/height, 1e-5, 100 );
	_this.camera.position.z = 2.0;
	_this.camera.position.x = 2.5;
	_this.camera.position.y = 1.2;

	//renderer
	_this.renderer = new THREE.WebGLRenderer({alpha: true});
	_this.renderer.GL = true;
	_this.renderer.setSize( width, height );
	_this.el = el;
	el.appendChild( _this.renderer.domElement );

	//trackball control
	_this.controls = new THREE.OrbitControls(_this.camera, _this.renderer.domElement);
	_this.controls.addEventListener('change', _this.render);

	_this.createplot = function(x)
	{
		var cexaxis = 0.5;
		var cexlab = 1;
		var fontaxis = "48px Arial";

		_this.V1 = new Float32Array(x.X);
		_this.V2 = new Float32Array(x.Y);
		_this.V3 = new Float32Array(x.Z);

		_this.pnum = x.pnum;
		_this.pnum3 = 3*x.pnum;

		//axis
		var group = new THREE.Object3D();

		var axisColor = new THREE.Color("#000000");
		var xAxisGeo = new THREE.Geometry();
		var yAxisGeo = new THREE.Geometry();
		var zAxisGeo = new THREE.Geometry();
		xAxisGeo.vertices.push(v(0, 0, 0), v(1, 0, 0));
		yAxisGeo.vertices.push(v(0, 0, 0), v(0, 1, 0));
		zAxisGeo.vertices.push(v(0, 0, 0), v(0, 0, 1));
		var xAxis = new THREE.Line(xAxisGeo, new THREE.LineBasicMaterial({color: axisColor, linewidth: 1}));
		var yAxis = new THREE.Line(yAxisGeo, new THREE.LineBasicMaterial({color: axisColor, linewidth: 1}));
		var zAxis = new THREE.Line(zAxisGeo, new THREE.LineBasicMaterial({color: axisColor, linewidth: 1}));
		xAxis.type = THREE.Lines;
		yAxis.type = THREE.Lines;
		zAxis.type = THREE.Lines;
		group.add(xAxis);
		group.add(yAxis);
		group.add(zAxis);
		scene.add(group);
		addText(group, 'x', cexlab, 1.1, 0, 0, axisColor);
		addText(group, 'y', cexlab, 0, 1.1, 0, axisColor);
		addText(group, 'z', cexlab, 0, 0, 1.1, axisColor);

		//points
		_this.pointsgeometry = new THREE.BufferGeometry();
		var pointsmaterial = new THREE.PointsMaterial( { color: 0x888888, size: 0.05 } );
		_this.pointgroup = new THREE.Object3D();

		_this.positions = new Float32Array(_this.pnum3);

		for (var i=0; i<_this.pnum; i++) {
			_this.positions[3*i] = _this.V1[i];
			_this.positions[3*i+1] = _this.V2[i];
			_this.positions[3*i+2] = _this.V3[i];
		}

		_this.pointsgeometry.addAttribute( 'position', new THREE.BufferAttribute( _this.positions, 3 ).setDynamic( true ) );

		_this.points = new THREE.Points( _this.pointsgeometry, pointsmaterial );
		_this.pointgroup.add( _this.points );
		scene.add( _this.pointgroup );

		/*Ticks and tick labels
		function tick(length, thickness, axis, ticks, ticklabels) {
			for (var j=0; j < ticks.length; j++ )
			{
			var tick = new THREE.Geometry();
			var a1 = ticks[j]; var a2 = ticks[j]; var a3=ticks[j];
			var b1 = length; var b2 = -length; var b3=-0.05;
			var c1 = 0; var c2 = 0; var c3=-0.08;
			if(axis==1){a1=length; b1=ticks[j]; c1=0; a2=-length; b2=ticks[j]; c2=0; a3=0.08; b3=ticks[j]; c3=-0.05;}
			else if(axis==2){a1=0; b1=length; c1=ticks[j];a2=0;b2=-length;c2=ticks[j]; a3=-0.08; b3=-0.05; c3=ticks[j];}
			tick.vertices.push(v(a1,b1,c1),v(a2,b2,c2));
			if(ticklabels)
			addText(group, ticklabels[j], cexaxis, a3, b3, c3, tickColor);
			var tl = new THREE.Line(tick, new THREE.LineBasicMaterial({color: tickColor, linewidth: thickness}));
			tl.type=THREE.Lines;
			group.add(tl);
			}
		}
		*/

		//vector
		function v(x,y,z) { return new THREE.Vector3(x,y,z); }

		//add text to objects
		function addText(object, string, scale, x, y, z, color) {
			var log2 = function(x) {return Math.log(x) / Math.log(2);};  // no Math.log2 function in RStudio on Windows :(
			var canvas = document.createElement('canvas');
			var context = canvas.getContext('2d');
			scale = scale / 4;
			context.fillStyle = "#" + color.getHexString();
			context.textAlign = 'center';
			context.font = fontaxis;
			var size = Math.max(64, Math.pow(2, Math.ceil(log2(context.measureText(string).width))));
			canvas.width = size;
			canvas.height = size;
			scale = scale * (size / 128);
			context = canvas.getContext('2d');
			context.fillStyle = "#" + color.getHexString();
			context.textAlign = 'center';
			context.textBaseline = 'middle';
			context.font = fontaxis;
			context.fillText(string, size / 2, size / 2);
			var amap = new THREE.Texture(canvas);
			amap.needsUpdate = true;
			var mat = new THREE.SpriteMaterial({
			map: amap,
			transparent: true,
			color: 0xffffff });
			sp = new THREE.Sprite(mat);
			sp.scale.set( scale, scale, scale );
			sp.position.x = x;
			sp.position.y = y;
			sp.position.z = z;
			object.add(sp);
		}
	};

	_this.render = function()
	{
		_this.renderer.render(scene, _this.camera);
	};

	_this.animate = function()
	{
		var newpositions = new Float32Array(_this.pnum3);
		for (var i=0; i<_this.pnum; i++) {
		newpositions[3*i] = _this.V1[(_this.stage-1)*_this.pnum+i];
		newpositions[3*i+1] = _this.V2[(_this.stage-1)*_this.pnum+i];
		newpositions[3*i+2] = _this.V3[(_this.stage-1)*_this.pnum+i];
		}

		var velocity = new Float32Array(_this.pnum3);

		if (_this.ConstantRate) {
			for (var k = 0; k < _this.pnum3; k++) {
				velocity[k] = [(newpositions[k] - _this.positions[k])/10];
			}

			for (var k = 0; k < _this.pnum3; k++) {
				if (_this.positions[k] != newpositions[k]) {
					_this.positions[k] += velocity[k];
				} else {_this.positions[k] = newpositions[k]}
			}
		} else {
			for (var k = 0; k < _this.pnum3; k++) {
				velocity[k] = [(newpositions[k] - _this.positions[k])/10];
				if (Math.abs(velocity[k])>0.0001) {
					_this.positions[k] += velocity[k];
				} else {_this.positions[k] = newpositions[k]}
			}
		}

		_this.points.geometry.attributes.position.needsUpdate = true;

		_this.render();

		requestAnimationFrame( _this.animate );

	};

};
