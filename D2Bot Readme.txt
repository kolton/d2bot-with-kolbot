D2BotSharp 
D2Bot#
by D3STROY3R

DISCLAIMER: 
D2BOTSHARP, A GAME MANAGER FROM D2BOT, ALL RIGHTS RESERVED
BY USING THIS SOFTWARE, YOU AGREE TO ITS END USER LICENSE AGREEMENT

END-USER LICENSE AGREEMENT FOR D2BOTSHARP IMPORTANT PLEASE READ THE TERMS AND CONDITIONS OF THIS LICENSE AGREEMENT CAREFULLY BEFORE CONTINUING WITH THIS PROGRAM INSTALL: D2BOT End-User License Agreement ("EULA") is a legal agreement between you (either an individual or a single entity) and D2BOT. for the D2BOT software product(s) identified above which may include associated software components, media, printed materials, and "online" or electronic documentation ("SOFTWARE PRODUCT"). By installing, copying, or otherwise using the SOFTWARE PRODUCT, you agree to be bound by the terms of this EULA. This license agreement represents the entire agreement concerning the program between you and D2BOT, (referred to as "licenser"), and it supersedes any prior proposal, representation, or understanding between the parties. If you do not agree to the terms of this EULA, do not install or use the SOFTWARE PRODUCT.

The SOFTWARE PRODUCT is protected by copyright laws and international copyright treaties, as well as other intellectual property laws and treaties. The SOFTWARE PRODUCT is licensed, not sold.

1. GRANT OF LICENSE. 
The SOFTWARE PRODUCT is licensed as follows: 
(a) Installation and Use.
D2BOT grants you the right to install and use copies of the SOFTWARE PRODUCT on your computer running a validly licensed copy of the operating system for which the SOFTWARE PRODUCT was designed [e.g., Windows 95, Windows NT, Windows 98, Windows 2000, Windows 2003, Windows XP, Windows ME, Windows Vista].
(b) Backup Copies.
You may also make copies of the SOFTWARE PRODUCT as may be necessary for backup and archival purposes.

2. DESCRIPTION OF OTHER RIGHTS AND LIMITATIONS.
(a) Maintenance of Copyright Notices.
You must not remove or alter any copyright notices on any and all copies of the SOFTWARE PRODUCT.
(b) Distribution.
You may not distribute registered copies of the SOFTWARE PRODUCT to third parties. Evaluation versions available for download from D2BOT's websites may be freely distributed.
(c) Prohibition on Reverse Engineering, Decompilation, and Disassembly.
You may not reverse engineer, decompile, or disassemble the SOFTWARE PRODUCT, except and only to the extent that such activity is expressly permitted by applicable law notwithstanding this limitation. 
(d) Rental.
You may not rent, lease, or lend the SOFTWARE PRODUCT.
(e) Support Services.
D2BOT may provide you with support services related to the SOFTWARE PRODUCT ("Support Services"). Any supplemental software code provided to you as part of the Support Services shall be considered part of the SOFTWARE PRODUCT and subject to the terms and conditions of this EULA. 
(f) Compliance with Applicable Laws.
You must comply with all applicable laws regarding use of the SOFTWARE PRODUCT.

3. TERMINATION 
Without prejudice to any other rights, D2BOT may terminate this EULA if you fail to comply with the terms and conditions of this EULA. In such event, you must destroy all copies of the SOFTWARE PRODUCT in your possession.

4. COPYRIGHT
All title, including but not limited to copyrights, in and to the SOFTWARE PRODUCT and any copies thereof are owned by D2BOT or its suppliers. All title and intellectual property rights in and to the content which may be accessed through use of the SOFTWARE PRODUCT is the property of the respective content owner and may be protected by applicable copyright or other intellectual property laws and treaties. This EULA grants you no rights to use such content. All rights not expressly granted are reserved by D2BOT.

5. NO WARRANTIES
D2BOT expressly disclaims any warranty for the SOFTWARE PRODUCT. The SOFTWARE PRODUCT is provided 'As Is' without any express or implied warranty of any kind, including but not limited to any warranties of merchantability, noninfringement, or fitness of a particular purpose. D2BOT does not warrant or assume responsibility for the accuracy or completeness of any information, text, graphics, links or other items contained within the SOFTWARE PRODUCT. D2BOT makes no warranties respecting any harm that may be caused by the transmission of a computer virus, worm, time bomb, logic bomb, or other such computer program. D2BOT further expressly disclaims any warranty or representation to Authorized Users or to any third party.

6. LIMITATION OF LIABILITY
In no event shall D2BOT be liable for any damages (including, without limitation, lost profits, business interruption, or lost information) rising out of 'Authorized Users' use of or inability to use the SOFTWARE PRODUCT, even if D2BOT has been advised of the possibility of such damages. In no event will D2BOT be liable for loss of data or for indirect, special, incidental, consequential (including lost profit), or other damages based in contract, tort or otherwise. D2BOT shall have no liability with respect to the content of the SOFTWARE PRODUCT or any part thereof, including but not limited to errors or omissions contained therein, libel, infringements of rights of publicity, privacy, trademark rights, business interruption, personal injury, loss of privacy, moral rights or the disclosure of confidential information.


 _   _ _____ ___________  _____  ___  ___  ___   _   _ _   _  ___   _     
| | | /  ___|  ___| ___ \/  ___| |  \/  | / _ \ | \ | | | | |/ _ \ | |    
| | | \ `--.| |__ | |_/ /\ `--.  | .  . |/ /_\ \|  \| | | | / /_\ \| |    
| | | |`--. \  __||    /  `--. \ | |\/| ||  _  || . ` | | | |  _  || |    
| |_| /\__/ / |___| |\ \ /\__/ / | |  | || | | || |\  | |_| | | | || |____
 \___/\____/\____/\_| \_|\____/  \_|  |_/\_| |_/\_| \_/\___/\_| |_/\_____/

Getting Started:

Make sure your directory is setup accordingly.

.../D2Bot dir/
in the initial directory these files must exist
Folder: D2BS
File: D2Bot.exe
File: profile.ini
File: d2bot.log

.../D2Bot dir/D2BS/
in your D2BS folder, make sure the following exist
File: D2BS.dll
File: D2M.dll
Folder: ex: kolbot

.../D2Bot dir/D2BS/scripts.../
in your initial scirpts folder you must have
Folder: data <--- THIS IS MANDATORY!
File: D2BotLead.dbj
File: D2BotFollow.dbj
File: Any other starters you want


D2BotSharp API (available from js)

the D2Bot.js file holds the current functions available from js to D2Bot
they include functions that
-write to console
-write to item log
-increment various values
-receive game data
-set status

D2BotSharp Usage
Some functions you can call from the console
>>start #  // this will start a particular profile based on name
>>stop # // this will stop a particular profile based on name
>>start all // this will start all profiles
>>stop all // this will stop all profiles
>>add // this will create new profile for you to fill out
>>del # // this will delete a profile 
>>send #1 msg #2 // this will send a string message to profile designated by #1 and will also send an id designated by #2
You can use >>send to add your own api to d2bot#, for example, with a windows message handler from scripts you can receive any command from d2bot#

Buttons
Start // This will start a highlighted (selected) profile, you may select multiple profiles and it will start them 
Stop // This will stop a highlighted (selected) profile, you may select multiple profiles and it will stop them
Edit // This will open a profile editor for already created profiles
Add // This will open a a new profile for you to edit
Duplicate // This will create a copy of a profile
Delete // This will delete a profile
Save // this will save the current run info on all the profiles

Right Click Profile
Increment CDKEY // manually go to next key or skip current key


Note: all buttons are responsive to multiple profile selections, you do not have to select 1 at a time.

Task Bar
File: Start ALL // this will start all profiles
File: Stop ALL // this will stop all profiles
File: Save // this will save the current run info on all profiles

Tools: Start Hidden // this will start d2 completely hidden, you won't even notice that you are botting!
Tools: Hide All // this will hide all currently visible d2's started from d2bot#
Tools: Show All // this will un-hide all d2's started form d2bot#
Tools: Edit // Same as above
Tools: Add // Save as above

d2bot.log
This file will hold information on disabled cdkeys, inuse cdkeys and timestamp when they were used

How to reorder your profiles?
Drag and drop them to where you want them to go!

How to add cdkeys: 
In profile editor, type the cdkeys as shown:
example.mpq
exmaple2.mpq
exmaple3.mpq
...
etc

Runs/Key This is how many runs before d2 will load a new cdkey, if you are not using any additional cdkeys, set it to -1

Parameters For all profiles, you should use -w (unless you want to bot / load in full screen). 
Other Flags include: 
-direct -txt
-ns
-lq
-skiptobnet

ex: -w -ns -lq
note: do not use -title and do not use -cachefix

Explanation of Profile Editor:
Name: this is the name of your profile
Account: account of your bot
Password: pass of your bot account
Character: the character you want to bot (case sensitive)
Game Name: prefix for game, if you are a leecher it does not matter
Game Pass: game password, if you are a leecher it does not matter
Difficulty: Hell, Nightmare, Norm
Mode: Battlenet Singleplayer
Entry Script: This is your starter file, unless you are using something custom, choose D2BotLead or D2BotFollow
NOTE: Entry Script also determines your scirpts folder, so if you are using yamb, you need to pick the starter from your yamb directory
Diablo Path: Choose any diablo 2 file, this can be game.exe game1.exe etc... you can use multiple game.exe's from the same d2 folder (incase you are using proxycap)

How to Resize:
drag and drop corners

Note: You also need a data folder in your scripts directory, this will hold game info for your characters