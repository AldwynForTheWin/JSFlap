 $(document).ready( function(){

	statesPool = [];
	transitions = {};
	SVG = $('svg');
	gCtxMenu = $('#gContextMenu');
	gCtxMenuLi = $('#gContextMenu li');
	off_top = SVG.offset().top;
	off_left = SVG.offset().left;
	x = 0;
	y = 0;
	count = 0;
	pathCounter = 0;
	activePath = null;
	activeState = null;
	openState = null;

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
		x = e.pageX - off_left;
		y = e.pageY - off_top;
		
		if (activeState != null && e.which != 3 && contextMenuHidden()) {
			activeState.find('text').attr({
				'x': x - activeState.find('text').width()/2,
				'y': y - activeState.find('text').height()*2
			});
			activeState.find('circle').attr({'cx': x, 'cy': y});
			for (path in transitions) {
				console.log(path);
				if (path['src'] == activeState.attr('id')) {
					x1 = $('#'+path['src']).find('line').attr('x1');
					y1 = $('#'+path['src']).find('line').attr('y1');
					textX = Math.abs(x1 - x)*.5 + Math.min(x1, x);
					textY = Math.abs(y1 - y)*.5 + Math.min(y1, y);
					
					$('#'+path['src']).find('line').attr({'x1': x, 'y1': y});
					$('#'+path['src']).find('text').attr({'x': textX, 'y': textY});
				} else if (path['dest'] == activeState.attr('id')) {
					x2 = $('#'+path['dest']).find('line').attr('x2');
					y2 = $('#'+path['dest']).find('line').attr('y2');
					textX = Math.abs(x2 - x)*.5 + Math.min(x2, x);
					textY = Math.abs(y2 - y)*.5 + Math.min(y2, y);
					
					$('#'+path['dest']).find('line').attr({'x2': x, 'y2': y});
					$('#'+path['dest']).find('text').attr({'x': textX, 'y': textY});
				}
			}
		}

		if (openState != null  && e.which != 3) {
			x1 = $('#'+activePath).find('line').attr('x1');
			y1 = $('#'+activePath).find('line').attr('y1');
			textX = Math.abs(x1 - x)*.5 + Math.min(x1, x);
			textY = Math.abs(y1 - y)*.5 + Math.min(y1, y);
				
			$('#'+activePath).find('line').attr({'x2': x, 'y2': y});
			$('#'+activePath).find('text').attr({'x': textX, 'y': textY});
		}
	});

	SVG.on('mouseup', function(e){
		if (activeState != null && e.which != 3) {
			x = e.pageX - off_left;
			y = e.pageY - off_top;
			activeState.find('text').attr({
				'x': x - activeState.find('text').width()/2,
				'y': y - activeState.find('text').height() + 50
			});
			activeState.find('circle').attr({'cx': x, 'cy': y});
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
			x = e.pageX - off_left;
			y = e.pageY - off_top;

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

			textWidth = $('#q'+count+' text').width()/2;
			textHeight = $('#q'+count+' text').height()/4;
			$('#q'+count+' text').attr({'x': x - textWidth, 'y': y + textHeight});

			if (openState != null && activePath != null) {
				$('#'+activePath).attr({'x2': x, 'y2': y});
				transitions[activePath]['dest'] = 'q'+count;
				activePath = null;
			}

			// statesPool.push(new State('q'+count, x, y));
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
			x = e.pageX - off_left;
			y = e.pageY - off_top;
			x1 = $('#'+activePath).find('line').attr('x1');
			y1 = $('#'+activePath).find('line').attr('y1');
			textX = Math.abs(x1 - x)*.5 + Math.min(x1, x);
			textY = Math.abs(y1 - y)*.5 + Math.min(y1, y);

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
			transitions[activePath] = {src: openState.attr('id'), dest: null};
			console.log(openState.attr('id'));
		}
	});

	$('#states').on('mouseup', 'g',  function(e){
		if (openState != null && activePath != null) {
			closeState = $(this);
			$('#'+activePath).find('line').attr({'x2': x, 'y2': y});
			$('#'+activePath).find('text').attr({'x': textX, 'y': textY});
			transitions[activePath]['dest'] = closeState.attr('id');
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