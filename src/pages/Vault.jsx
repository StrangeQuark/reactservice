// Integration file: Vault

import Toolbar from '../components/Toolbar'
import VaultList from '../components/vaultservice/VaultList'
import { RequireAuth } from '../context/AuthContext' // Integration line: Auth

const Vault = () => {
    return(
        <RequireAuth> {/* Integration line: Auth */}
            <Toolbar />

            <VaultList />
        </RequireAuth> // Integration line: Auth
    )
}

export default Vault