import React, { useState, useEffect, useRef} from "react";
import { SearchOutlined } from "@ant-design/icons";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { Layout, Table, Drawer, TableProps, InputRef, TableColumnType, Input, Button, Flex, Modal, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import { useGetCharactersQuery } from "../services/characters";

const { Header, Content } = Layout;
interface ColumnType {
    id: string;
    name: string;
    image: string;
    status: string;
};

interface CharInfo {
    name: string;
    image: string;
    status: string;
    location: string;
    origin: string;
    episodes: number;
}


const CharacterList = () => {
    const { data, isLoading } = useGetCharactersQuery();

    let charactersData = [];
    if (data) {
        charactersData = data.results;
    }

    const [openDrawer, setOpenDrawer] = useState(false);
    const [characterInfo, setCharacterInfo] = useState<CharInfo>({name: "", image: "", status: "", location: "", origin: "", episodes: 0});

    const selectCharacter = (record: any) => {
        const location = record.location;
        const origin = record.origin;
        const episode = record.episode;
        setCharacterInfo({name: record.name, image: record.image, status: record.status, location: location.name,origin: origin.name, episodes: episode.length
        });
        console.log("Info", characterInfo);
        setOpenDrawer(true);
    };

    const onCloseDrawer = () => {
        setOpenDrawer(false);
    };
    
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    type DataIndex = keyof ColumnType;

    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps['confirm'],
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };


    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<ColumnType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder="Искать имя"
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Flex wrap gap="small">
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    icon={<SearchOutlined />}
                    size="small"
                    style={{ width: 90 }}
                >
                    Поиск
                </Button>
                <Button
                    onClick={() => clearFilters && handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Сброс
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                    confirm({ closeDropdown: false });
                    setSearchText((selectedKeys as string[])[0]);
                    setSearchedColumn(dataIndex);
                    }}
                >
                    Фильтр
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                    close();
                    }}
                >
                    Закрыть
                </Button>
                </Flex>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
          <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
          record[dataIndex]
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase()),
        filterDropdownProps: {
          onOpenChange(open) {
            if (open) {
              setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        },
        render: (text) =>
          searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ''}
            />
        ) : (
            text
        ),
    });

    const columns: TableProps<ColumnType>["columns"] = [
        {
            title: "Аватар",
            dataIndex: "image",
            key: "image",
            render: (dataIndexValue, record) => <img src={dataIndexValue} alt={record.name} style={{maxWidth: "50px", maxHeight: "50px"}}/>
        },
        {
            title: "Имя",
            dataIndex: "name",
            key: "name",
            ...getColumnSearchProps("name"),
        },
        {
            title: "Статус",
            dataIndex: "status",
            key: "status",
            filters: [
                {
                  text: "Живой",
                  value: "Alive",
                },
                {
                  text: "Мертвый",
                  value: "Dead",
                },
                {
                    text: "Неизвестно",
                    value: "unknown",
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value as string) === 0,
        }
    ];
    
    return <>
        <Layout>
            <Header style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                <p style={{color: "white", fontWeight: "bold", fontSize: "3vw"}}>Rick and Morty characters</p>
            </Header>
            <Content style={{padding: 25, backgroundColor: "grey", minHeight: "100vh"}}>
                    <Table dataSource={charactersData} columns={columns} 
                        onRow={(record, rowIndex) => {
                            return {
                              onClick: event => {selectCharacter(record)},
                            };
                        }}
                    />

                    <Drawer 
                        title="Информация о персонаже"
                        width={720}
                        onClose={onCloseDrawer}
                        open={openDrawer}
                        >
                        {<Flex vertical>
                            <img src={characterInfo.image} alt={characterInfo.name} style={{width: "100px", height: "100px"}}></img>
                            <p>Имя: {characterInfo.name}</p>
                            <p>Статус: {characterInfo.status}</p>
                            <p>Расположение: {characterInfo.location}</p>
                            <p>Происхождение: {characterInfo.origin}</p>
                            <p>Количество эпизодов: {characterInfo.episodes}</p>
                        </Flex> }
                    </Drawer>

                    <Modal title={null} open={isLoading} footer={null}>
                        <Flex align="center" gap="middle" vertical>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                            <h4>Загрузка...</h4>
                        </Flex>
                    </Modal>
            </Content>
        </Layout>
    </>

};

export default CharacterList;