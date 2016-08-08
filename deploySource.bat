@SETLOCAL
@SET ECLIPSE_WORKSPACE_PATH=%1
@SET ECLIPSE_SRC_FOLDER=%2

@IF EXIST %ECLIPSE_WORKSPACE_PATH%\%ECLIPSE_SRC_FOLDER% (
    @CALL grunt --deploy=sourceBase --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER%
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZEBASE
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZEBASE_CTRL
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZECMP_IC
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZECTRL_COMMONS
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZECTRL_MAIN
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZECTRL_APP
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZEMOD_APP
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZEMOD_CMPGN
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZEMOD_DSHB
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZEMOD_QUICKPAY
    @CALL grunt --deploy=source --eclipseProjectPath=%ECLIPSE_WORKSPACE_PATH% --eclipseProjectName=%ECLIPSE_SRC_FOLDER% --srcFolderName=ZEMOD_OTHERS
) ELSE (
    @ECHO Path %ECLIPSE_WORKSPACE_PATH%\%ECLIPSE_SRC_FOLDER% does not exists.
)

@ENDLOCAL