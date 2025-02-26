import React, { useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Layout, Table, Drawer } from "antd";
import { useGetCharactersQuery } from "../services/characters";

const { Header, Content } = Layout;

const CharacterList = () => {

    
    const { data, error, isLoading } = useGetCharactersQuery();
    if (isLoading) {
        return <div>Loading...</div>;
    };

    console.log("Data", data);
    const charactersData = data.results;


    return <>
        <Layout>
            <Header style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                <h1 style={{color: "white"}}>Rick and Morty characters</h1>
            </Header>
            <Content style={{padding: 25, backgroundColor: "grey", minHeight: "100vh"}}>
                <div style={{
                    background: "white",
                    minHeight: 280,
                    padding: 24,
                    borderRadius: 25,
                }}>
                    <ul>
                        {charactersData.map((character: any) => (
                            <li key={character.id}>{character.name} <img alt="character portrait" src={character.image}></img></li>
                        ))}
                    </ul>
                </div>
            </Content>
        </Layout>
    </>

};

export default CharacterList;