import os
import re

files = os.listdir(".")

def GetExp(filename):
    index = filename.rfind(".")
    if(index == -1):
        return None
    return filename[index+1:len(filename)]

for filename in files:
    if(GetExp(filename)=="png"):
        obj = re.match("([0-9A-Z]+)*",filename)
        newName = obj.group(1)
        if(newName[0]=='A'):
            if(filename.find("横")!=-1):
                newName+="H"
            elif(filename.find("撇")!=-1):
                newName+="P"
            elif(filename.find("捺")!=-1):
                newName+="N"
        if(filename.find("大")!=-1):
            newName+="_B.png"
        else:
            newName+="_S.png"
        cmd = "copy \"./"+ filename + "\" \"./" + newName + "\""
        print(cmd)
        print(os.system(cmd))


