var MAX = 30;
var rows = [
  { label: 'Research N1',    received: 12, requested: 0, required: 0 },
  { label: 'Create N1',      received: 24, requested: 0, required: 0 },
  { label: 'Organise N1',    received: 6,  requested: 0, required: 0 },
  { label: 'Communicate N1', received: 6,  requested: 0, required: 0 },
  { label: 'Learn N1',       received: 12, requested: 0, required: 0 },
  { label: 'Research N2',    received: 9,  requested: 3, required: 0 },
  { label: 'Create N2',      received: 3,  requested: 15, required: 6 },
  { label: 'Organise N2',    received: 6,  requested: 0, required: 0 },
  { label: 'Communicate N2', received: 3,  requested: 0, required: 3 },
  { label: 'Learn N2',       received: 3,  requested: 3, required: 6 }
];

var chart = document.getElementById('ec-chart');

// Axis
var axisRow = document.createElement('div');
axisRow.style.cssText = 'display:grid;grid-template-columns:140px 1fr;gap:16px;margin-bottom:6px;';
var axisBlank = document.createElement('span');
var axisTicks = document.createElement('div');
axisTicks.style.cssText = 'position:relative;height:16px;';
[0,3,6,9,12,15,18,21,24,27,30].forEach(function(n) {
  var tick = document.createElement('span');
  tick.textContent = n;
  tick.style.cssText = 'position:absolute;left:' + (n / MAX * 100).toFixed(1) + '%;transform:translateX(-50%);font-size:10px;color:#7a7872;letter-spacing:0.04em;';
  axisTicks.appendChild(tick);
});
axisRow.appendChild(axisBlank);
axisRow.appendChild(axisTicks);
chart.appendChild(axisRow);

rows.forEach(function(row) {
  var div = document.createElement('div');
  div.className = 'ec-row';

  var label = document.createElement('span');
  label.className = 'ec-label';
  label.textContent = row.label;

  var track = document.createElement('div');
  track.className = 'ec-bar-track';

  var rPct   = (row.received / MAX * 100).toFixed(1);
  var rqPct  = ((row.received + row.requested) / MAX * 100).toFixed(1);
  var reqPct = ((row.received + row.requested + row.required) / MAX * 100).toFixed(1);

  if (row.required > 0) {
    var seg = document.createElement('div');
    seg.className = 'ec-bar-segment ec-bar-required';
    seg.style.left = '0';
    seg.style.width = reqPct + '%';
    track.appendChild(seg);
  }
  if (row.requested > 0) {
    var seg2 = document.createElement('div');
    seg2.className = 'ec-bar-segment ec-bar-requested';
    seg2.style.left = '0';
    seg2.style.width = rqPct + '%';
    track.appendChild(seg2);
  }
  if (row.received > 0) {
    var seg3 = document.createElement('div');
    seg3.className = 'ec-bar-segment ec-bar-received';
    seg3.style.left = '0';
    seg3.style.width = rPct + '%';
    track.appendChild(seg3);
  }

  div.appendChild(label);
  div.appendChild(track);
  chart.appendChild(div);
});
