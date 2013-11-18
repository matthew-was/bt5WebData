f_name = raw_input("Enter the first 5 characters of the file: ")

det_num = input("Enter the detector to make zero: ")
try:
	det_val = int(det_num)
except ValueError:
	print("That's not an int!")
if det_val == 1:
	col_val = 2
elif det_val == 2:
	col_val = 1
elif det_val == 3:
	col_val = 4
elif det_val == 4:
	col_val = 5
elif det_val == 5:
	col_val = 6

for i in range (1, 100):
	try:
		f_name_in = f_name + '00' + str(i) + '.bt5'
		f_name_out = f_name + '00' + str(i) + '_mod.bt5'
		f_in = open(f_name_in, 'r')
		f_out = open(f_name_out, 'w')

		for i in range(13):
   			f_out.write(f_in.readline())
   	
   		while 1:
			data_line = f_in.readline()
			if data_line == '': break
			detector_line = f_in.readline()
			detector_counts = detector_line.split(',')
			detector_counts[col_val] = '0'
			f_out.write(data_line)
			f_out.write(",".join(detector_counts))
    	
		f_in.close()
		f_out.close()
	except IOError:
		print "complete"
		break
