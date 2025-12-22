"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { API_URL } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";

/**
 * @brief Component for uploading Excel files to the backend.
 * @details Supports importing both mechanics and customers. Handles file selection, type switching, and upload status.
 */
export default function ExcelUpload() {
    const { t } = useLanguage();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [uploadType, setUploadType] = useState<"mechanics" | "customers">("mechanics");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("file", file);

        const endpoint = uploadType === "mechanics"
            ? `${API_URL}/api/upload/mechanics`
            : `${API_URL}/api/upload/customers`;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Upload failed");
            }

            setMessage(`${t('upload_success')}: ${data.message}`);
            setFile(null);
        } catch (error: any) {
            setMessage(`${t('upload_error')}: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('import_data')} (Excel)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <RadioGroup defaultValue="mechanics" onValueChange={(val: string) => setUploadType(val as "mechanics" | "customers")} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mechanics" id="r1" />
                            <Label htmlFor="r1">{t('mechanics')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="customers" id="r2" />
                            <Label htmlFor="r2">{t('customers')}</Label>
                        </div>
                    </RadioGroup>

                    <Input
                        key={file ? file.name : 'reset'} // Reset input on success
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    <Button onClick={handleUpload} disabled={!file || uploading}>
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('uploading')}
                            </>
                        ) : (
                            `${t('upload_button')} ${uploadType === 'mechanics' ? t('mechanics') : t('customers')}`
                        )}
                    </Button>
                    {message && (
                        <p className={`text-sm ${message.startsWith(t('upload_error')) ? "text-red-500" : "text-green-500"}`}>
                            {message}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
