[Setup]
AppName=My Family Finances
AppVersion=1.0.5
AppPublisher=Carl Prewitt Jr
AppPublisherURL=https://github.com/rages4calm/my-family-finances
AppSupportURL=https://github.com/rages4calm/my-family-finances/issues
AppUpdatesURL=https://github.com/rages4calm/my-family-finances/releases
DefaultDirName={autopf}\My Family Finances
DefaultGroupName=My Family Finances
AllowNoIcons=yes
LicenseFile=LICENSE
OutputDir=dist
OutputBaseFilename=MyFamilyFinances-1.0.5-Setup
SetupIconFile=public\family.ico
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
Source: "dist\MyFamilyFinances-win32-x64\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "resources\app\release*,resources\app\*.zip,resources\app\*.bat,resources\app\installer.iss,resources\app\src"

[Icons]
Name: "{group}\My Family Finances"; Filename: "{app}\MyFamilyFinances.exe"
Name: "{group}\{cm:UninstallProgram,My Family Finances}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\My Family Finances"; Filename: "{app}\MyFamilyFinances.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\MyFamilyFinances.exe"; Description: "{cm:LaunchProgram,My Family Finances}"; Flags: nowait postinstall skipifsilent