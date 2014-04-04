var statesPool = [];
var transitions = [];
var SVG = $('svg');
var gCtxMenu = $('#gContextMenu');
var gCtxMenuLi = $('#gContextMenu li');
var off_top = SVG.offset().top;
var off_left = SVG.offset().left;
var count = 0;
var pathCounter = 0;
var activePath = null;
var activeState = null;
var openState = null;

 $(document).ready( function(){

	$(document).on('contextmenu', SVG, function(e){
		// alert('Context Menu event has fired!');
		return false;
	});

	function showContextMenu(e) {
		gCtxMenu.css("top", e.pageY);
		gCtxMenu.css("left", e.pageX);
		gCtxMenu.show();
	}

	function hideContextMenu(){
		gCtxMenu.hide();
	}

	function contextMenuHidden() {
		return gCtxMenu.is(":hidden");
	}

	gCtxMenuLi.click(function(e){
		gCtxMenu.hide();
	});

	SVG.on('mousemove', function(e){
		var x = e.pageX - off_left;
		var y = e.pageY - off_top;
		
		if (activeState != null && e.which != 3 && contextMenuHidden()) {
			activeState.find('text').attr({
				'x': x - activeState.find('text').width()/2,
				'y': y - activeState.find('text').height()*2
			});
			activeState.find('circle').attr({'cx': x, 'cy': y});
			for (var i = 0; i < transitions.length; i++) {
				var path = transitions[i];
				var line = $('#'+path['label']);

				if (path['src'] == activeState.attr('id')) {
					var x1 = line.find('line').attr('x1');
					var y1 = line.find('line').attr('y1');
					var textX = Math.abs(x1 - x)*.5 + Math.min(x1, x);
					var textY = Math.abs(y1 - y)*.5 + Math.min(y1, y);
					
					line.find('line').attr({'x1': x, 'y1': y});
					line.find('text').attr({'x': textX, 'y': textY});
				} else if (path['dest'] == activeState.attr('id')) {
					var x2 = line.find('line').attr('x2');
					var y2 = line.find('line').attr('y2');
					var textX = Math.abs(x2 - x)*.5 + Math.min(x2, x);
					var textY = Math.abs(y2 - y)*.5 + Math.min(y2, y);
					
					line.find('line').attr({'x2': x, 'y2': y});
					line.find('text').attr({'x': textX, 'y': textY});
				}
			}
		}

		if (openState != null  && e.which != 3) {
			var x1 = $('#'+activePath).find('line').attr('x1');
			var y1 = $('#'+activePath).find('line').attr('y1');
			var textX = Math.abs(x1 - x)*.5 + Math.min(x1, x);
			var textY = Math.abs(y1 - y)*.5 + Math.min(y1, y);
				
			$('#'+activePath).find('line').attr({'x2': x, 'y2': y});
			$('#'+activePath).find('text').attr({'x': textX, 'y': textY});
		}
	});

	SVG.on('mouseup', function(e){
		if (activeState != null && e.which != 3) {
			var x = e.pageX - off_left;
			var y = e.pageY - off_top;
			activeState.find('text').attr({
				'x': x - activeState.find('text').width()/2,
				'y': y - activeState.find('text').height() + 50
			});
			activeState.find('circle').attr({'cx': x, 'cy': y});
			// for (var i = 0; i < transitions.length; i++) {
			// 	var path = transitions[i];
			// 	var line = $('#'+path['label']);
			// 	if (path['src'] == activeState.attr('id')) {
			// 		var x1 = line.find('line').attr('x1');
			// 		var y1 = line.find('line').attr('y1');
			// 		var textX = Math.abs(x1 - x)*.5 + Math.min(x1, x);
			// 		var textY = Math.abs(y1 - y)*.5 + Math.min(y1, y);
					
			// 		line.find('line').attr({'x1': x, 'y1': y});
			// 		line.find('text').attr({'x': textX, 'y': textY});
			// 	} else if (path['dest'] == activeState.attr('id')) {
			// 		var x2 = line.find('line').attr('x2');
			// 		var y2 = line.find('line').attr('y2');
			// 		var textX = Math.abs(x2 - x)*.5 + Math.min(x2, x);
			// 		var textY = Math.abs(y2 - y)*.5 + Math.min(y2, y);
					
			// 		line.find('line').attr({'x2': x, 'y2': y});
			// 		line.find('text').attr({'x': textX, 'y': textY});
			// 	}
			// }
			activeState = null;
		}
	});

	SVG.on('mousedown', function(e){		
		if (activeState == null) {
			if (e.which != 3) {
				hideContextMenu();
			} else {
				return;
			}
			var x = e.pageX - off_left;
			var y = e.pageY - off_top;

			$('#states').append($(document.createElementNS('http://www.w3.org/2000/svg', 'g')).attr({'id': 'q'+count, 'x': x, 'y': y}));

			$('#q'+count).append(
				$(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr(
					{'cx': x, 'cy': y, 'r': 30, 'stroke': 'black', 'stroke-width': 1, 'fill': 'white'}
				)
			).append(
				$(document.createElementNS('http://www.w3.org/2000/svg', 'text')).attr(
					{'x': x, 'y': y, 'stroke': 'black', 'fill': 'black'}
				).html('Q'+count)
			);

			var textWidth = $('#q'+count+' text').width()/2;
			var textHeight = $('#q'+count+' text').height()/4;
			$('#q'+count+' text').attr({'x': x - textWidth, 'y': y + textHeight});

			if (openState != null && activePath != null) {
				$('#'+activePath).attr({'x2': x, 'y2': y});
				transitions[activePath]['dest'] = 'q'+count;
				activePath = null;
			}

			count++;
		} else {
			if (e.which != 3) {
				hideContextMenu();
			} else {
				return;
			}
		}
	});

	$('#states').on('mousedown', 'g', function(e){
		if (activeState == null) {
			activeState = $(this);
		}
		if (e.which == 3) {
			showContextMenu(e);
		} else {
			hideContextMenu();
		}
	});

	$('#states').on('dblclick', 'g',  function(e){
		if (activeState == null && openState == null && activePath == null && e.which != 3) {
			var x = e.pageX - off_left;
			var y = e.pageY - off_top;
			var x1 = $('#'+activePath).find('line').attr('x1');
			var y1 = $('#'+activePath).find('line').attr('y1');
			var textX = Math.abs(x1 - x)*.5 + Math.min(x1, x);
			var textY = Math.abs(y1 - y)*.5 + Math.min(y1, y);

			openState = $(this);
			activePath = 'path' + pathCounter;
			$('#transitions').append($(document.createElementNS('http://www.w3.org/2000/svg', 'g')).attr({'id': activePath}));
			$('#'+activePath).append(
				$(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr(
					{'x1': x, 'y1': y, 'x2': x, 'y2': y, 'stroke': 'red', 'stroke-width': 2}
				)
			).append(
				$(document.createElementNS('http://www.w3.org/2000/svg', 'text')).attr(
					{'x': textX, 'y': textY, 'stroke': 'blue'}
				).html('[a, b, ~]')
			);
			transitions.push({label: activePath, src: openState.attr('id'), dest: null});
		}
	});

	$('#states').on('mouseup', 'g',  function(e){
		if (openState != null && activePath != null) {
			var x = e.pageX - off_left;
			var y = e.pageY - off_top;
			var x1 = $('#'+activePath).find('line').attr('x1');
			var y1 = $('#'+activePath).find('line').attr('y1');
			var textX = Math.abs(x1 - x)*.5 + Math.min(x1, x);
			var textY = Math.abs(y1 - y)*.5 + Math.min(y1, y);

			closeState = $(this);
			$('#'+activePath).find('line').attr({'x2': x, 'y2': y});
			$('#'+activePath).find('text').attr({'x': textX, 'y': textY});
			transitions[pathCounter]['dest'] = closeState.attr('id');
			pathCounter++;
			activePath = null;
			openState = null;
			closeState = null;
		}
	});	

});









function State(label, x, y) {
	this.label = label;
	this.x = x;
	this.y = y;
	this.transitions = {};
	this.final = false;
}

function Transition(state, x1, y1) {
	this.openState = state;
	this.closeState = null;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = null;
	this.y2 = null;
}