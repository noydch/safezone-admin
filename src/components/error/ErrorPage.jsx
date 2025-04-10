import React from 'react'

const ErrorPage = () => {
    return (
        <div className="error-container">
            <div className="error-content">
                <h1>ຂໍອະໄພ! ມີຂໍ້ຜິດພາດເກີດຂຶ້ນ</h1>
                <p>ການໂຫລດຂໍ້ມູນລົ້ມເຫລວ. ກະລຸນາລອງໃຫມ່ອີກຄັ້ງ.</p>
                <button
                    className="retry-button"
                    onClick={() => window.location.reload()}
                >
                    ລອງໃຫມ່ອີກຄັ້ງ
                </button>
            </div>
        </div>
    )
}

export default ErrorPage