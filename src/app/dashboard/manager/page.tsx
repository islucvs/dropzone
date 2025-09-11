'use client'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export default function TabsDemo() {
  return (
    <div className="p-3 flex w-[100%] h-[100%] flex-col gap-6 " style={{backgroundImage: "url(../images/menu_image.png)"}}>
      <Tabs className="mt-[45px] h-[100%] flex-col">
        <TabsList>
          <TabsTrigger value="assault">Assault</TabsTrigger>
          <TabsTrigger value="sniper">Sniper</TabsTrigger>
          <TabsTrigger value="demolition">Demolition</TabsTrigger>
          <TabsTrigger value="recon">Recon</TabsTrigger>
          <TabsTrigger value="lighttank">Light Tank</TabsTrigger>
          <TabsTrigger value="mbts">MBT's</TabsTrigger>
          <TabsTrigger value="artillery">Artillery</TabsTrigger>
          <TabsTrigger value="aas">Anti-Aircraft</TabsTrigger>
          <TabsTrigger value="helicopters">Helicopters</TabsTrigger>
          <TabsTrigger value="fighterjets">Fighter Jet</TabsTrigger>
          <TabsTrigger value="bomber">Bomber</TabsTrigger>
          <TabsTrigger value="destroyers">Destroyers</TabsTrigger>
          <TabsTrigger value="carrier">Carrier</TabsTrigger>
        </TabsList>
        <TabsContent className="backdrop-blur-sm" value="assault">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="inf_spet">Russian Spetsnaz</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="inf_spet">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_spetsnaz.png" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>Spetsnaz Operator</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.png" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.png" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
            
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="sniper">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">USMC Sniper</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/snipers/usmc_sniper.png" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Sniper</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="demolition">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="dem_usmc">USMC Demolition</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="dem_usmc">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/demolition/demolition_usmc.png" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Demolition</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="recon">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>        
        <TabsContent className="backdrop-blur-sm" value="lighttank">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="mbts">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="mbts">M1A1 Abrams</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="mbts">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/mbt/mbt_abrams.png" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>M1A1 Abrams TUSK II</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="artillery">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="aas">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="helicopters">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="fighterjets">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="bomber">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="destroyers">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent className="backdrop-blur-sm" value="carrier">
          <div className="h-[100%] w-[100%] border-0 flex grid-cols-2 gap-3 p-3">
            <Tabs className="w-[100%] grid-cols-2 gap-2 border-0">
              <TabsList className="w-[20%] grid grid-cols-1 gap-2" >
                <TabsTrigger value="adf_spec">ADF Specialist</TabsTrigger>
                <TabsTrigger value="usmc_spec">USMC Specialist</TabsTrigger>
                <TabsTrigger value="sas_spec">SAS Specialist</TabsTrigger>
              </TabsList>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="adf_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_adf.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>ADF Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
              <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="usmc_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_usmc.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>USMC Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
                            <TabsContent className="w-[100%] bg-transparent pl-[10%]" value="sas_spec">
                <Card className="bg-transparent text-white">
                  <CardHeader>
                    <div className="flex justify-center">
                    <img src="../images/infantry/infantry_sas.jpg" className="h-[1%] w-[40%]"/>
                    </div>
                    <CardTitle>SAS Specialist</CardTitle>
                    <CardDescription>
                      The Hornet is a versatile and agile fighter aircraft used by
                      the UNSC Navy. It is capable of both air-to-air and air-to-ground
                      combat, making it a valuable asset in various mission profiles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
