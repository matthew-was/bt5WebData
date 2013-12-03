import math

plottable_data = {
           'type': '1d',
           'title': 'BT5 Data Data',
           'options': {
               'axes': {'xaxis': {'label':'A4'}, 'yaxis': {'label':'Counts'}},
               'series': [],
               },
           'data': []
       }

f_in = open('sep 1/64D4A001.bt5', 'r')

#temp1 = f_in.readline(16)
#temp1 = temp1.replace('\'','')
#temp1 = temp1.replace(' ','')
#temp1 = temp1.replace('.bt5','_mod.json')
#f_out = open(temp1, 'w')


plottable_data["type"]='1d'

for i in range(2):
	f_in.readline()
temp2 = f_in.readline().strip()
#f_out.write('\'title\':\'' + temp2 + '\',\n')
plottable_data["title"]=temp2
#f_out.write('\'options\': {\n')
plottable_data["options"]["axes"]["xaxis"]["label"]='A2'
plottable_data["options"]["axes"]["yaxis"]["label"]='Counts * 10^6 / Monitor Counts'
#f_out.write('\'axes\': {\'xaxis\': {\'label\':\'A2\'}, \'yaxis\':{\'label\':\'Counts * 10^6 / Monitor Counts\'}},\n')
plottable_data["options"]["axes"]["series"]=[]
#f_out.write('\'series\': [],\n')
#f_out.write('\'legend\': {\'show\': False, \'placement\': \'se\'},\n')
#f_out.write('\'cursor\': {\'show\': True, \'tooltipLocation\':\'se\',\'tooltipOffset\': 0},\n')
#f_out.write('},\n')
#f_out.write('\'clear_existing\':True,\n')
#f_out.write('\'data\':[\n')
plottable_data["clear_existing"]=True

for i in range(10):
	f_in.readline()

while 1:
	motor_line = f_in.readline().split()
	if motor_line == []:
		break
	print motor_line[0]	
		
	detector_line = f_in.readline().split(',')
	detector_sum=int(detector_line[1])+int(detector_line[2])+int(detector_line[4])+int(detector_line[5])+int(detector_line[6])
	detector_monitor = int(detector_line[0])
	detector_total = detector_sum*1000000 / detector_monitor
	print detector_total
#	f_out.write(motor_line)
#	f_out.write(":")
#	f_out.write( str(detector_total) + ',\n')
#f_out.write(']')
  
f_in.close()
#f_out.close()
