import os

files = os.listdir(".")

def GetExp(filename):
    index = filename.rfind(".")
    if(index == -1):
        return None
    return filename[index+1:len(filename)]

for filename in files:
    if(GetExp(filename)=="png" and filename.find("_")==-1):
        cmd = "del \"./"+ filename + "\""
        print(cmd)
        print(os.system(cmd))


