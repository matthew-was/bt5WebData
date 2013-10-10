import math
import icpformat as icp
import simplejson
import os
import glob

plottable_data = [{'type':'1d','title':'','options':{'axes':{'xaxis': {'label':''}, 'yaxis': {'label':''}},'series':[],'legend':{'show': False, 'placement': 'se'},'cursor':{'show': True, 'tooltipLocation':'se', 'tooltipOffset': 0},},'metadata':{},'clear_existing':True,'data':[[]]}]

dataDir = "/Users/Matthew/Desktop/Empty/"
os.chdir(dataDir)
objList = {}

tempList = glob.glob('*.bt5')
tempList.sort()

k = ""
dirList = []
for k in tempList:
	if k[0:3] != "fpx":
		dirList.append(k)

i= ""
for i in dirList:	
	f = icp.read(i)
	test1 = f.filename
	test1 = test1[0:5]
	listVal = -1
	if test1 not in objList:
		objList[test1] = ""
		plottable_data = [{'type':'1d','title':'','options':{'axes':{'xaxis': {'label':''}, 'yaxis': {'label':''}},'series':[],'legend':{'show': False, 'placement': 'se'},'cursor':{'show': True, 'tooltipLocation':'se', 'tooltipOffset': 0},},'metadata':{},'clear_existing':True,'data':[[]]}]
		plottable_data[0]["title"] = f.comment
		plottable_data[0]["options"]["axes"]["xaxis"]["label"]="A2"
		plottable_data[0]["options"]["axes"]["yaxis"]["label"]="Counts x 10^6 / Monitor"
		j = 0
		while (j < f.points):
			a2 = f.column["a2"][j]
			monitor = f.column["monitor"][j]
			sum = f.counts[j][1] + f.counts[j][2] + f.counts[j][4] + f.counts[j][5] + 	f.counts[j][6]
			j += 1
			total = sum * 1000000 / monitor
			plottable_data[0]["data"][0].append([float(a2),int(total)])
		objList[test1] = plottable_data
	else:
		plottable_data = [{'type':'1d','title':'','options':{'axes':{'xaxis': {'label':''}, 'yaxis': {'label':''}},'series':[],'legend':{'show': False, 'placement': 'se'},'cursor':{'show': True, 'tooltipLocation':'se', 'tooltipOffset': 0},},'metadata':{},'clear_existing':True,'data':[[]]}]
		j=0
		while (j < f.points):
			a2 = f.column["a2"][j]
			monitor = f.column["monitor"][j]
			sum = f.counts[j][1] + f.counts[j][2] + f.counts[j][4] + f.counts[j][5] + 	f.counts[j][6]
			j += 1
			total = sum * 1000000 / monitor
			objList[test1][0]["data"][0].append([float(a2),int(total)])

for l in objList:
	fname = l + ".json"
	f_out = open(fname, 'w')
	writeable_data = simplejson.dumps(objList[l])
	f_out.write(writeable_data)
	f_out.close()
