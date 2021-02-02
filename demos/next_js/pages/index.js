import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
var performanceMonitor = null;

const Home = () => {

    const [butStatus, setButStatus] = useState(false);

    const onLog = (info, logLevel) => {
        showData(info);
    }

    const onConnectionStateChanged = (oldState, newState) => {

        if (newState == ergometer.MonitorConnectionState.readyForCommunication) {
            //this.performanceMonitor.sampleRate=SampleRate.rate250ms;
            showData(JSON.stringify(performanceMonitor.device));

        }

    }

    const connectToDevice = (performanceMonitor) => {

        performanceMonitor.requestDevics().then((devices) => {
            if (devices.length > 0) {
                performanceMonitor.connectToDevice(devices[0])
                    .then(() => {
                        console.log(performanceMonitor.device);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }

        });

    }

    const showInfo = (info) => {
        console.log("data", info);
    }

    const showData = (data) => {
        console.log("data", data);
    }

    const resetPM = () => {
        console.log("Reset Machine");
    }



    useEffect(() => {
        performanceMonitor = new ergometer.PerformanceMonitorUsb();

        performanceMonitor.logLevel = ergometer.LogLevel.debug; //by default it is error, for more debug info  change the level
        performanceMonitor.logEvent.sub(this, onLog);
        performanceMonitor.connectionStateChangedEvent.sub(this, onConnectionStateChanged);
        //connect to the rowing
        performanceMonitor.strokeStateEvent.sub(this, (oldState, newState) => {
            showInfo("New state:" + newState.toString());
        })
        performanceMonitor.trainingDataEvent.sub(this, (data) => {
            showInfo("training data :" + JSON.stringify(data, null, "  "));
        });
        performanceMonitor.strokeDataEvent.sub(this, (data) => {
            showInfo("stroke data:" + JSON.stringify(data, null, "  "));
        });
        performanceMonitor.powerCurveEvent.sub(this, (data) => {
            showInfo("power curve data:" + JSON.stringify(data, null, "  "));
        });

        if (ergometer.PerformanceMonitorUsb.canUseUsb()) {
            setButStatus(true);
        }

    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
                <script src="/libs/ergometer.js" />
            </Head>

            <main className={styles.main}>
                <h1>Web USB Ergometer Test</h1>

                {
                    butStatus ?
                        <button id="StartScan" onClick={() => { connectToDevice(performanceMonitor) }}>Start scan</button>
                        :
                        <p>Your browser do not support or cannot open USB ports</p>
                }
                <br />
                {
                    butStatus ?
                        <>
                            <button id="getinfo" onClick={() => { getPMStatus() }}>get info</button>

                            <br />
                            <button id="getinfo" onClick={() => { resetPM() }}>reset</button>

                            <br />
                            <h2>Info</h2>


                            <p id="data">
                                Extra info
                            </p>
                        </>
                        : null}
            </main>


        </div>
    )
}


export default Home