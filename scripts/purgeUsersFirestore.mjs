import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const defaultFirebaseConfig = {
  apiKey: "AIzaSyBsaRLUUFG1QdSjMMzxzOVmzW4aqrN0TbM",
  authDomain: "goalskid-app-4c276.firebaseapp.com",
  projectId: "goalskid-app",
  storageBucket: "goalskid-app.firebasestorage.app",
  messagingSenderId: "828956321348",
  appId: "1:828956321348:web:babec7f340ae5c7f823e11"
};

const app = initializeApp(defaultFirebaseConfig);
const db = getFirestore(app);

async function purgeTestUsers() {
  console.log('🚀 Iniciando purga de usuarios en Firestore (Proyecto: goalskid-app)...');
  try {
    const usersSnap = await getDocs(collection(db, 'users'));
    console.log(`📊 Total de documentos encontrados en /users: ${usersSnap.size}`);

    let deletedCount = 0;
    let preservedCount = 0;

    for (const docSnap of usersSnap.docs) {
      const data = docSnap.data();
      const email = data.email || '';
      const uid = docSnap.id;

      if (email === 'josferestudio@gmail.com') {
        console.log(`🛡️ Conservando cuenta Super Admin: ${email} (UID: ${uid})`);
        preservedCount++;
      } else {
        console.log(`🗑️ Eliminando usuario de prueba: ${email || 'Sin Email'} (UID: ${uid})...`);
        await deleteDoc(doc(db, 'users', uid));
        deletedCount++;
      }
    }

    console.log(`\n✅ Purga completada con éxito:`);
    console.log(`   - Usuarios eliminados: ${deletedCount}`);
    console.log(`   - Usuarios preservados (Admin): ${preservedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante la purga de Firestore:', error);
    process.exit(1);
  }
}

purgeTestUsers();
