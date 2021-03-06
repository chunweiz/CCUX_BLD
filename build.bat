@CALL grunt --build=base --baseFolder=ZEBASE --basePath=nrg
@CALL grunt --build=base --baseFolder=ZEBASE_CTRL --basePath=ute/ui
@CALL grunt --build=control --controlLibrary=ute.ui.main --controlFolder=ZECTRL_MAIN
@CALL grunt --build=control --controlLibrary=ute.ui.commons --controlFolder=ZECTRL_COMMONS
@CALL grunt --build=control --controlLibrary=ute.ui.app --controlFolder=ZECTRL_APP
@CALL grunt --build=module --moduleName=nrg.module.app --moduleFolder=ZEMOD_APP
@CALL grunt --build=module --moduleName=nrg.module.others --moduleFolder=ZEMOD_OTHERS
@CALL grunt --build=module --moduleName=nrg.module.dashboard --moduleFolder=ZEMOD_DSHB
@CALL grunt --build=module --moduleName=nrg.module.campaign --moduleFolder=ZEMOD_CMPGN
@CALL grunt --build=module --moduleName=nrg.module.quickpay --moduleFolder=ZEMOD_QUICKPAY
@CALL grunt --build=module --moduleName=nrg.module.billing --moduleFolder=ZEMOD_BILLING
@CALL grunt --build=module --moduleName=nrg.module.bupa --moduleFolder=ZEMOD_BUPA
@CALL grunt --build=module --moduleName=nrg.module.search --moduleFolder=ZEMOD_SEARCH
@CALL grunt --build=module --moduleName=nrg.module.nnp --moduleFolder=ZEMOD_NNP
@CALL grunt --build=module --moduleName=nrg.module.usage --moduleFolder=ZEMOD_USAGE
@CALL grunt --build=component --componentName=nrg.component.ic --componentFolder=ZECMP_IC
