import math
import icpformat as i
import simplejson

f = i.read("/Users/Matthew/Desktop/ED8801/ED81H001.bt5")

plottable_data = [{
            'type':'1d',
            'title':'NG7 Data',
            'options':{
                'axes':{'xaxis': {'label':'A4'}, 'yaxis': {'label':'Counts'}},
                'series':[],
                'legend':{'show': False, 'placement': 'se'},
                'cursor':{'show': True, 'tooltipLocation':'se', 'tooltipOffset': 0},
                },
            'metadata':{},
            'clear_existing':True,
            'data':[[]]
        }]

temp1 = f.filename
temp1 = temp1.replace('.bt5','_mod.json')
f_out = open(temp1, 'w')

plottable_data[0]["title"] = f.comment
plottable_data[0]["options"]["axes"]["xaxis"]["label"]="a2"
plottable_data[0]["options"]["axes"]["yaxis"]["label"]="Counts x 10^6 / Monitor"

i = 0
while (i < f.points):
	a2 = f.column["a2"][i]
	monitor = f.column["monitor"][i]
	sum = f.counts[i][1] + f.counts[i][2] + f.counts[i][4] + f.counts[i][5] + f.counts[i][6]
	i += 1
	total = sum * 1000000 / monitor
	plottable_data[0]["data"][0].append([float(a2),int(total)])

writable_data = simplejson.dumps(plottable_data)
f_out.write(writable_data)
f_out.close()
